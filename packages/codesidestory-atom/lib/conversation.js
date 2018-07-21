import { CompositeDisposable, Disposable, TextEditor } from "atom";
import etch from "etch";
import { formatSlackMessages, formatAgo } from "./helpers";
import { getScreenRecorder } from "./screen/screen-recorder";

const $ = etch.dom;
const KEY_ENTER = 13;

export default class Conversation {
  constructor({ lines, onSend, onHide, refUrl }) {
    this.lines = lines;
    this.onSend = onSend;
    this.onHide = onHide;
    this.scrollTop = 0;
    this.etsMap = {};
    this.screenRecorder = getScreenRecorder(
      refUrl,
      this.update.bind(this, lines),
      this.onSend.bind(this)
    );

    this.disposables = new CompositeDisposable();
    this.inputdisp = new CompositeDisposable();
    this.disposables.add(this.inputdisp);

    etch.initialize(this);
    this.disposables.add(new Disposable(() => etch.destroy(this)));

    const inputView = atom.views.getView(this.refs.input);

    this.disposables.add(
      atom.commands.add(inputView, {
        "codesidestory:post-comment": this.postConvo.bind(this)
      })
    );
    this.disposables.add(
      atom.commands.add(inputView, {
        "codesidestory:hide-comment": onHide
      })
    );
    setTimeout(this.update.bind(this, lines), 300);
  }

  focus = () => this.refs.input.element.focus();

  scrollToBottom = () => {
    const container = this.refs.container;
    container.scrollTop = container.scrollHeight - container.clientHeight;
  };

  writeAfterUpdate = () => {
    atom.views.getView(this.refs.input).classList.add("css-input");

    const container = this.refs.container;
    if (this.noDown) {
      container.scrollTop = this.scrollTop;
    } else {
      this.scrollToBottom();
    }

    if (
      container.scrollTop + container.clientHeight ===
      container.scrollHeight
    ) {
      this.refs.scrollDown.classList.add("hidden");
    } else {
      this.refs.scrollDown.classList.remove("hidden");
    }
    if (container.scrollTop === 0) {
      this.refs.scrollUp.classList.add("hidden");
    } else {
      this.refs.scrollUp.classList.remove("hidden");
    }

    this.focus();
  };

  readAfterUpdate = () => {
    const editor = this.refs.input;
    this.inputdisp.dispose();
    this.inputdisp.add(
      atom.textEditors.add(editor),
      atom.textEditors.maintainGrammar(editor),
      atom.textEditors.maintainConfig(editor)
    );
    this.scrollTop = this.refs.container.scrollTop;
  };

  update = (lines, noDown) => {
    this.noDown = noDown;
    this.lines = lines;
    return etch.update(this);
  };

  renderLine = line => {
    return $.div(
      {
        className: "css-convo-line"
      },
      $.div(
        { className: "text-subtle pull-right css-ago" },
        formatAgo(line.event_ts)
      ),
      $.div({
        innerHTML: formatSlackMessages(line.text)
      })
    );
  };

  postConvo = event => {
    this.onSend(this.refs.input.getText());
    this.refs.input.setText("");
  };

  scroll = up => {
    const container = this.refs.container;
    const scrollBy = Math.round(container.clientHeight / 1.25);
    this.scrollTop = this.scrollTop + (up ? -scrollBy : scrollBy);
    this.update(this.lines, true);
  };

  filterDups = ({ event_ts }) => {
    if (this.etsMap[event_ts]) {
      return false;
    }
    this.etsMap[event_ts] = true;
    return true;
  };

  sortEvent = (a, b) => {
    var aSec = parseInt(a.event_ts.split(".").shift(), 10);
    const bSec = parseInt(b.event_ts.split(".").shift(), 10);
    return aSec === bSec ? 0 : aSec < bSec ? -1 : 1;
  };

  render = () => {
    this.etsMap = {};

    return $.div(
      { className: "css-convo inline-block" },
      $.div(
        { className: "css-close-chat", onClick: () => this.onHide() },
        $.i({ className: "icon icon-x" })
      ),
      $.div(
        {
          className: "css-scroll hidden",
          ref: "scrollUp",
          onClick: () => this.scroll(true)
        },
        $.i({ className: "icon icon-chevron-up" })
      ),
      $.div(
        { className: "css-lines-wrapper", ref: "container" },
        ...this.lines
          .filter(this.filterDups)
          .sort(this.sortEvent)
          .map(this.renderLine)
      ),
      $.div(
        {
          className: "css-scroll hidden",
          ref: "scrollDown",
          onClick: () => this.scroll()
        },
        $.i({ className: "icon icon-chevron-down" })
      ),
      $.div(
        { className: "css-input-wrapper" },
        $(TextEditor, {
          ref: "input",
          mini: true
        }),
        this.screenRecorder.getDom()
      )
    );
  };

  destroy = () => this.disposables.dispose();
}
