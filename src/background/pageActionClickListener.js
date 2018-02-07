/**
 * Sets up a page action click listener to send a message to the content
 * scripts to gather pull requests in the GMail inbox.
 *
 * @param {Object} chrome - Chrome API object
 */
exports.setup = chrome => {
  chrome.pageAction.onClicked.addListener(tab => {
    chrome.tabs.sendMessage(tab.id, { type: 'get_pull_requests' });
  });
};
