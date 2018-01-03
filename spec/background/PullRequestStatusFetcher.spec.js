const PullRequestStatusFetcher = require('../../src/background/PullRequestStatusFetcher');

describe('PullRequestStatusFetcher', function () {
  let fetcher;

  const normalizeQuery = query => query.replace(/[ \n]+/g, ' ');

  beforeEach(function () {
    fetcher = new PullRequestStatusFetcher('654abcd');
  });

  describe('constructor', function () {
    it('sets a GraphQL connection', function () {
      const graph = fetcher.graph;
      expect(graph.getUrl()).toEqual('https://api.github.com/graphql');
      expect(graph.headers()).toEqual({ Authorization: 'Bearer 654abcd' });

      const actual = normalizeQuery(graph.fragments().pullRequestStatus);
      const expected = normalizeQuery(` fragment pullRequestStatus on PullRequest {
        state
        commits(last: 1) {
          nodes {
            commit {
              status {
                state
              }
            }
          }
        }
      }`);
      expect(actual).toEqual(expected);
    });
  });

  describe('#multiFetch', function () {
    beforeEach(function () {
      const response = {
        q1: {
          pullRequest: {
            state: 'OPEN',
            commits: { nodes: [{ commit: { status: { state: 'SUCCESS' } } }] },
          },
        },
        q0: {
          pullRequest: {
            state: 'MERGED',
            commits: { nodes: [{ commit: { status: null } }] },
          },
        },
      };
      spyOn(fetcher, 'graph').and.returnValue(Promise.resolve(response));
    });

    it('sends the right GraphQL query', function () {
      const matcher = {
        asymmetricMatch: actual => {
          const expected = normalizeQuery(`query {
            q0: repository(owner: "who", name: "what") {
              pullRequest(number: 4) {
                ...pullRequestStatus
              }
            }
            q1: repository(owner: "death", name: "metal") {
              pullRequest(number: 6) {
                ...pullRequestStatus
              }
            }
          }`);
          return normalizeQuery(actual) === expected;
        },
      };

      return fetcher.multiFetch(['who/what#4', 'death/metal#6']).then(map => {
        expect(fetcher.graph).toHaveBeenCalledWith(matcher);
      });
    });

    it('returns a Promise of pull request status details', function () {
      return fetcher.multiFetch(['who/what#4', 'death/metal#6']).then(map => {
        expect(map.size).toEqual(2);
        expect(map.get('who/what#4')).
          toEqual({ state: 'MERGED', commitStatus: null });
        expect(map.get('death/metal#6')).
          toEqual({ state: 'OPEN', commitStatus: 'SUCCESS' });
      });
    });
  });
});
