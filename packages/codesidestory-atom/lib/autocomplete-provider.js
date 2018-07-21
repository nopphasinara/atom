const USER_CACHE_REFRESH_INERVAL = 10 * 60 * 1000; // 10 min.

export default class AutocompleteProvider {
  scopeSelector = ".text.plain.null-grammar";
  enableCustomTextEditorSelector = true;

  constructor() {
    this.users = [];
  }

  init = usersRef => {
    this.usersRef = usersRef;
    this.getUsers();
  };

  getUsers = () => {
    if (!this.usersRef) {
      return Promise.resolve(this.users);
    }

    if (
      this.lastGet &&
      Date.now() - this.lastGet < USER_CACHE_REFRESH_INERVAL
    ) {
      return Promise.resolve(this.users);
    }

    return this.usersRef.once("value").then(snap => {
      const users = snap.val() || {};
      this.lastGet = Date.now();
      this.users = Object.keys(users).map(id => users[id]);
      return this.users;
    });
  };

  getTextEditorSelector = () => {
    return "atom-text-editor.css-input";
  };

  getSuggestions = ({
    editor,
    bufferPosition: pos,
    scopeDescriptor,
    prefix,
    activatedManually
  }) => {
    const startAtPos = [pos.row, pos.column - prefix.length - 1];
    const endAtPost = [pos.row, pos.column - prefix.length];
    const atChar = editor.getTextInBufferRange([startAtPos, endAtPost]);
    if (atChar !== "@") {
      return Promise.resolve();
    }

    return this.getUsers().then(users => {
      try {
        return users
          .filter(
            user => user.name && user.name.toLowerCase().indexOf(prefix) === 0
          )
          .map(user => {
            const uname = user.name
              ? user.name.toLowerCase().split(" ").shift()
              : "";
            return {
              text: `<@${user.id}|${uname}>`,
              displayText: `@${user.name}`,
              replacementPrefix: `@${prefix}`,
              rightLabel: user.name
            };
          });
      } catch (err) {
        console.error("getSuggestions()", err);
        return Promise.reject(err);
      }
    });
  };

  onDidInsertSuggestion({ editor, triggerPosition, suggestion }) {
    // console.log("Inside insert position");
  }

  dispose = () => {
    if (this.usersRef) {
      this.usersRef.off();
    }
  };
}
