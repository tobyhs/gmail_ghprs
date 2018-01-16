const chrome = require('sinon-chrome');

const { setup } = require('../../src/background/pageActionVisibility');

describe('pageActionVisibility', function () {
  afterEach(function () {
    chrome.flush();
  });

  describe('.setup', function () {
    let originalDeclarativeContent;

    beforeEach(function () {
      originalDeclarativeContent = chrome.declarativeContent;

      // The current version of sinon-chrome is missing a few things for
      // chrome.declarativeContent, so I need to stub them myself.
      chrome.declarativeContent = {
        onPageChanged: jasmine.createSpyObj(
          'onPageChanged', ['addRules', 'removeRules']
        ),
        PageStateMatcher: class {
          constructor(args) {
            this.args = args;
          }
        },
        ShowPageAction: class {},
      };
    });

    afterEach(function () {
      chrome.declarativeContent = originalDeclarativeContent;
    });

    it('sets up a rule to enable the page action when on https://mail.google.com', function () {
      setup(chrome);
      chrome.runtime.onInstalled.dispatch();
      const { addRules, removeRules } = chrome.declarativeContent.onPageChanged;

      expect(removeRules).toHaveBeenCalled();
      const removeRulesArgs = removeRules.calls.mostRecent().args;
      expect(removeRulesArgs[0]).toBeUndefined();
      expect(addRules).not.toHaveBeenCalled();
      removeRulesArgs[1]();

      expect(addRules).toHaveBeenCalled();
      const addedRule = addRules.calls.mostRecent().args[0][0];
      expect(addedRule.conditions.length).toEqual(1);
      const condition = addedRule.conditions[0];
      expect(condition.constructor).
        toBe(chrome.declarativeContent.PageStateMatcher);
      expect(condition.args).
        toEqual({ pageUrl: { urlPrefix: 'https://mail.google.com/' } });
      expect(addedRule.actions.length).toEqual(1);
      expect(addedRule.actions[0].constructor).
        toBe(chrome.declarativeContent.ShowPageAction);
    });
  });
});
