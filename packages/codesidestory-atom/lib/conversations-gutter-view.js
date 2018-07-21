import { CompositeDisposable, Disposable } from "atom";
import etch from "etch";
import { postConversation } from "./helpers";
import leftPad from "left-pad";
import Conversation from "./conversation";

const $ = etch.dom;
const CONVERSATION_ID = "codesidestory.conversation";

export default class ConversationsGutterView {
  constructor({ editor, codeLineNo, codeLineRef, channelId, visible }) {
    this.editor = editor;
    this.codeLineRef = codeLineRef;
    this.codeLineNo = codeLineNo;
    this.channelId = channelId;

    this.lines = [];

    this.disposables = new CompositeDisposable();

    etch.initialize(this);
    this.disposables.add(new Disposable(() => etch.destroy(this)));

    this.toggleConvo = this.toggleConvo.bind(this);
    this.refs.convo.addEventListener("click", this.toggleConvo);
    this.disposables.add(
      new Disposable(() =>
        this.refs.convo.removeEventListener("click", this.toggleConvo)
      )
    );

    const convosRef = this.codeLineRef.child("convos");
    convosRef.on("child_added", this.onLineAdded.bind(this));
    this.disposables.add(new Disposable(() => convosRef.off()));

    if (visible) {
      this.visible = false;
      this.toggleConvo();
    }
  }

  update = () => etch.update(this);

  onLineAdded = lineSnap => {
    const lineObj = lineSnap.val();
    if (!lineObj) {
      return;
    }
    this.lines.push(lineObj);
    this.thread_ts = lineObj.thread_ts;

    if (this.visible) {
      this.update();
      if (this.convo) {
        this.convo.update(this.lines);
      }
    }
  };

  toggleConvo = () => {
    const { editor, codeLineNo, lines } = this;
    const markers = this.editor.findMarkers({ CONVERSATION_ID, codeLineNo });
    if (markers.length > 0) {
      this.visible = false;
      markers.map(marker => marker.destroy()); // this.convo should be destroyed here.
      this.convo = null;
    } else {
      this.visible = true;
      const item = new Conversation({
        lines,
        onSend: this.onSend.bind(this),
        onHide: this.toggleConvo.bind(this),
        refUrl: this.codeLineRef.toString()
      });
      this.convo = item;
      const marker = editor.markScreenPosition([codeLineNo, 0]);
      marker.setProperties({ CONVERSATION_ID, codeLineNo });

      editor
        .decorateMarker(marker, { type: "overlay", position: "after", item })
        .onDidDestroy(() => item.destroy());

      this.disposables.add(new Disposable(() => marker.destroy()));
    }
  };

  getChatData = () => {
    const { codeLineNo, data } = this;
    if (data) {
      return Promise.resolve(data);
    }
    return this.codeLineRef.once("value").then(snap => {
      this.data = snap.val() ? snap.val() : { codeLineNo };
      return this.data;
    });
  };

  getTextWithCode = () => {
    const { start, end } = this.editor.getCurrentParagraphBufferRange();
    const padLen = String(end.row).length + 2; // +2 for ">>"
    const [, filePath] = atom.project.relativizePath(this.editor.getPath());
    const lines = [];
    for (var i = start.row; i <= end.row; i++) {
      const line = this.editor.lineTextForBufferRow(i);
      let lineNo = leftPad(i, padLen);
      if (this.codeLineNo === i) {
        lineNo = ">>" + lineNo.substring(2);
      }
      lines.push(`${lineNo} ${line}`);
    }
    return `>${filePath}\n` + "```" + lines.join("\n") + "```\n";
  };

  onSend = text => {
    let code;
    if (!this.thread_ts) {
      // start of thread. post code.
      code = this.getTextWithCode();
    }
    postConversation({
      ref: this.codeLineRef.toString(),
      event: {
        text,
        code,
        channel: this.channelId,
        thread_ts: this.thread_ts
      }
    });
  };

  render() {
    return $.div({
      className: "icon icon-comment-discussion css-convo-icon",
      ref: "convo"
    });
  }

  destroy = () => this.disposables.dispose();
}
