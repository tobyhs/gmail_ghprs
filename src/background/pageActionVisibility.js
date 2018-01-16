/**
 * Sets up a rule to enable the page action when on a GMail inbox.
 *
 * @param {Object} chrome - Chrome API object
 */
exports.setup = chrome => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
      chrome.declarativeContent.onPageChanged.addRules([
        {
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { urlPrefix: 'https://mail.google.com/' },
            })
          ],
          actions: [new chrome.declarativeContent.ShowPageAction()],
        },
      ]);
    });
  });
}
