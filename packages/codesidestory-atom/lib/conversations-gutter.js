import { CompositeDisposable, Disposable } from "atom";
import etch from "etch";
import ConversationsGutterView from "./conversations-gutter-view";
import { getActiveRecorder } from "./screen/screen-recorder";

const $ = etch.dom;
const GUTTER_ID = "codesidestory.gutter";

export default class ConversationsGutter {
  constructor({ editor, fileRef, channelId }) {
    this.editor = editor;
    this.fileRef = fileRef;
    this.channelId = channelId;
    this.disposables = new CompositeDisposable();

    // Keep marker disposables separate to delete and recreate on state update.
    this.markerdisps = new CompositeDisposable();
    this.disposables.add(new Disposable(() => this.markerdisps.dispose()));
    this.disposables.add(
      atom.commands.add(atom.views.getView(this.editor), {
        "codesidestory:start-conversation": this.startConvo.bind(this)
      }),
      atom.contextMenu.add({
        "atom-text-editor": [
          {
            label: "CodeSideStory",
            submenu: [
              {
                label: "Start Conversation",
                command: "codesidestory:start-conversation"
              }
            ]
          }
        ]
      })
    );

    const linesRef = this.fileRef.child("lines");
    linesRef.on("child_added", this.onConversationAdded.bind(this));
    this.disposables.add(new Disposable(() => linesRef.off()));

    const lineNo = getActiveRecorder(linesRef.toString());
    if (lineNo) {
      this.addMarker(lineNo, true);
    }
  }

  onConversationAdded = snap => {
    const convoData = snap.val();
    if (!convoData) {
      return;
    }
    let { codeLineNo, convos } = convoData;
    if (codeLineNo !== 0 && !codeLineNo) {
      codeLineNo = parseInt(snap.key, 10);
    }
    if (isNaN(codeLineNo)) {
      console.error("Not updating marker. No codeLineNo found", convoData);
      return;
    }
    this.addMarker(codeLineNo, !convos); // !convos implies first message
  };

  addMarker(codeLineNo, visible) {
    const { editor, channelId } = this;
    const markers = editor.findMarkers({ GUTTER_ID, codeLineNo });
    markers.forEach(m => m.destroy());
    const codeLineRef = this.fileRef.child(`lines/${codeLineNo}`);
    const item = new ConversationsGutterView({
      editor,
      codeLineNo,
      codeLineRef,
      channelId,
      visible:
        visible || getActiveRecorder(this.fileRef.toString()) === codeLineNo
    });

    const marker = editor.markScreenPosition([codeLineNo, 0]);
    marker.setProperties({ GUTTER_ID, codeLineNo });

    this.gutter()
      .decorateMarker(marker, { type: "block", position: "after", item })
      .onDidDestroy(() => item.destroy());

    this.markerdisps.add(new Disposable(() => marker.destroy()));
  }

  startConvo = () => {
    const range = this.editor.getSelectedBufferRange();
    const lineNo = range.end.row;

    this.addMarker(lineNo, true);
  };

  gutter = () => {
    const { editor } = this;
    let gutter = editor.gutterWithName(GUTTER_ID);
    if (gutter) {
      return gutter;
    }
    gutter = editor.addGutter({ name: GUTTER_ID, priority: 10 });
    this.disposables.add(
      new Disposable(() => {
        try {
          gutter.destroy();
        } catch (err) {
          console.error(err);
        }
      })
    );
    return gutter;
  };

  destroy = () => {
    this.markerdisps.dispose();
    this.disposables.dispose();
  };

  serialize = () => {
    return {};
  };
}
