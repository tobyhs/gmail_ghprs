const chrome = require('sinon-chrome');

const { setup } = require('../../src/background/pageActionClickListener');

describe('pageActionClickListener', function() {
  beforeEach(function() {
    chrome.flush();
    setup(chrome);
  });

  afterAll(function() {
    chrome.flush();
  });

  describe('.setup', function() {
    it('adds a page action click listener', function() {
      expect(chrome.pageAction.onClicked.addListener.calledOnce).toBe(true);
    });

    it('sends a message on the click event', function() {
      expect(chrome.tabs.sendMessage.notCalled).toBe(true);
      const tabId = Math.round(Math.random() * 1000) + 1;
      chrome.pageAction.onClicked.dispatch({ id: tabId });
      const msg = { type: 'get_pull_requests' };
      expect(chrome.tabs.sendMessage.withArgs(tabId, msg).calledOnce).toBe(true);
    });
  });
});
