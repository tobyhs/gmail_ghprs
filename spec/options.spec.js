const fs = require('fs');
const jsdom = require('jsdom');

const options = require('../src/options');

describe('OptionsHandler', function () {
  let window;
  let document;
  let storage;
  let handler;

  beforeEach(function () {
    window = (new jsdom.JSDOM(fs.readFileSync('static/options.html'))).window;
    document = window.document;

    storage = jasmine.createSpyObj('storage', ['getItem', 'setItem']);
    storage.getItem.and.returnValue('ToKeN');

    handler = new options.OptionsHandler(document, storage);
    handler.addListeners();
  });

  it('restores the token after content has loaded', function() {
    document.dispatchEvent(new window.Event('DOMContentLoaded'));
    expect(storage.getItem).toHaveBeenCalledWith(options.GITHUB_TOKEN_KEY);
    expect(document.getElementById('githubTokenInput').value).toEqual('ToKeN');
  });

  it('saves the token after the Save button is clicked', function() {
    document.getElementById('githubTokenInput').value = 'newTok';
    document.getElementById('save').click();
    expect(storage.setItem).toHaveBeenCalledWith(options.GITHUB_TOKEN_KEY, 'newTok');
  });
});
