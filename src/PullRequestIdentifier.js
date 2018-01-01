/**
 * An object with properties to identify a pull request.
 * @typedef {Object} PullRequestIdProperties
 * @property {string} repoOwner - username of owner of repository
 * @property {string} repoName - name of repository
 * @property {number} number - number that identifies the pull request
 */


/**
 * An error thrown when the `parse` function is given invalid input
 */
class ParseError extends Error {
  constructor() {
    super('Can not parse pull request identifier');
    this.name = 'ParseError';
  }
}

/**
 * Parses a pull request identifier string.
 *
 * @param {string} identifier
 *   a pull request identifier in the form repoOwner/repoName#pullRequestNumber
 * @returns {PullRequestIdProperties}
 */
function parse(identifier) {
  if (!/^[-a-z0-9]+\/[-a-z0-9]+#\d+$/i.test(identifier)) {
    throw new ParseError();
  }

  let [ repoOwner, repoName, number ] = identifier.split(/\/|#/);
  number = parseInt(number);
  return { repoOwner, repoName, number };
}

module.exports = { ParseError, parse };
