const graphql = require('graphql.js');

const PullRequestIdentifier = require('../PullRequestIdentifier');

/**
 * @typedef {Object} PullRequestStatus
 * @property {string} state
 *   state of the pull request; see
 *   https://developer.github.com/v4/enum/pullrequeststate/
 * @property {?string} commitStatus
 *   status of the latest commit in the pull request; see
 *   https://developer.github.com/v4/enum/statusstate/
 */

/**
 * Something to fetch pull request states/statuses
 */
class PullRequestStatusFetcher {
  /**
   * @param {string} token - GitHub API access token
   */
  constructor(token) {
    this.graph = graphql('https://api.github.com/graphql', {
      asJSON: true,
      headers: { Authorization: `Bearer ${token}` },
      fragments: {
        pullRequestStatus: `on PullRequest {
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
        }`,
      },
    });
  }

  /**
   * Fetches the states and latest commit statuses of the given pull requests.
   *
   * @param {string[]} prIdentifiers
   *   identifiers in the form repoOwner/repoName#pullRequestNumber
   * @returns {Promise.<Map.<string, PullRequestStatus>>}
   *   a Promise that resolves to a mapping from PR identifiers to pull request
   *   status details
   */
  multiFetch(prIdentifiers) {
    const prs = prIdentifiers.map(id => PullRequestIdentifier.parse(id));
    // I haven't found a way to use variadic variables in a GraphQL query, so
    // I'm resorting to one query to fetch all statuses via string templating,
    // which isn't great either.
    const query = prs.map((pr, i) =>
      `q${i}: repository(owner: "${pr.repoOwner}", name: "${pr.repoName}") {
        pullRequest(number: ${pr.number}) {
          ...pullRequestStatus
        }
      }`
    ).join('\n');

    return this.graph(`query { ${query} }`).then(data => {
      const map = new Map();
      prIdentifiers.forEach((id, i) => {
        const prData = data[`q${i}`].pullRequest;
        const commitStatus = prData.commits.nodes[0].commit.status;
        map.set(id, {
          state: prData.state,
          commitStatus: commitStatus && commitStatus.state,
        });
      });
      return map;
    });
  }
}

module.exports = PullRequestStatusFetcher;
