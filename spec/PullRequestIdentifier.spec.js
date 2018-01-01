const PullRequestIdentifier = require('../src/PullRequestIdentifier');

describe('PullRequestIdentifier', function () {
  describe('ParseError', function () {
    it('has the right message', function () {
      expect(new PullRequestIdentifier.ParseError().message).
        toEqual('Can not parse pull request identifier');
    });

    it('has the right name', function () {
      expect(new PullRequestIdentifier.ParseError().name).toEqual('ParseError');
    });
  });

  describe('.parse', function () {
    it('throws a ParseError when given invalid input', function () {
      ['', 'abc', 'a/b', 'z#2', 'a/b#x', 'a/b#-1'].forEach(identifier => {
        expect(() => { PullRequestIdentifier.parse(identifier) }).
          toThrowError(PullRequestIdentifier.ParseError);
      });
    });

    it('returns a PullRequestIdProperties', function () {
      const { repoOwner, repoName, number } = PullRequestIdentifier.parse(
        'johndoe/hello-world#101'
      );
      expect(repoOwner).toEqual('johndoe');
      expect(repoName).toEqual('hello-world');
      expect(number).toEqual(101);
    });
  });
});
