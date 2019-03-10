'use babel';

import IdeStandardjs from '../lib/ide-standardjs';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('IdeStandardjs', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('ide-standardjs');
  });

  describe('when the ide-standardjs:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.ide-standardjs')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'ide-standardjs:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.ide-standardjs')).toExist();

        let ideStandardjsElement = workspaceElement.querySelector('.ide-standardjs');
        expect(ideStandardjsElement).toExist();

        let ideStandardjsPanel = atom.workspace.panelForItem(ideStandardjsElement);
        expect(ideStandardjsPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'ide-standardjs:toggle');
        expect(ideStandardjsPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.ide-standardjs')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'ide-standardjs:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let ideStandardjsElement = workspaceElement.querySelector('.ide-standardjs');
        expect(ideStandardjsElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'ide-standardjs:toggle');
        expect(ideStandardjsElement).not.toBeVisible();
      });
    });
  });
});
