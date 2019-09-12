'use babel';

export default {
  activate (state) {
    console.log("OK");
  },

  deactivate () {
    this.subscriptions.dispose();
  },
};
