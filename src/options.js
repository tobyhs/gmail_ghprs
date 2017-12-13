const GITHUB_TOKEN_KEY = 'githubToken';

/**
 * This handles the restoring and saving of options.
 */
class OptionsHandler {

  /**
   * @param {HTMLDocument} document - HTML document to restore options to and save options from
   * @param {Storage} storage - storage to load and save options
   */
  constructor(document, storage) {
    this.document = document;
    this.storage = storage;
  }

  /**
   * Adds event listeners for the options page.
   */
  addListeners() {
    this.document.addEventListener('DOMContentLoaded', () => this.restore());
    this.document.getElementById('save').addEventListener('click', () => this.save());
  }

  /**
   * Restores the previously saved options on the document.
   */
  restore() {
    const token = this.storage.getItem(GITHUB_TOKEN_KEY);
    this.document.getElementById('githubTokenInput').value = token;
  }

  /**
   * Saves the options.
   */
  save() {
    const token = this.document.getElementById('githubTokenInput').value
    this.storage.setItem(GITHUB_TOKEN_KEY, token);
  }
}

if (typeof document !== 'undefined') {
  new OptionsHandler(document, localStorage).addListeners();
}

module.exports = {
  GITHUB_TOKEN_KEY,
  OptionsHandler,
}
