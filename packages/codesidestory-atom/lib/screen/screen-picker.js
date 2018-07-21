import { CompositeDisposable, Disposable } from "atom";
import { desktopCapturer } from "electron";
import etch from "etch";
const $ = etch.dom;

export default class ScreenPicker {
  constructor(props) {
    this.props = props;
    this.screens = [];
    this.disposables = new CompositeDisposable();
    this.uidisposables = new CompositeDisposable();
    this.disposables.add(this.uidisposables);

    etch.initialize(this);

    this.disposables.add(new Disposable(() => etch.destroy(this)));
  }

  show = () => {
    this.getScreens();
    this.getModalPanel().show();
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  };

  hide = () => {
    this.getModalPanel().hide();
  };

  getScreens = () => {
    const options = { types: ["window", "screen"] };
    this.screens = [];
    desktopCapturer.getSources(options, (err, sources) => {
      if (err) {
        console.error(err);
        return;
      }

      for (let source of sources) {
        const thumb = source.thumbnail.toDataURL();
        if (!thumb) continue;
        const title = source.name.slice(0, 20);
        this.screens.push({ title, thumb, id: source.id });
      }
      this.update();
    });
  };

  update = () => {
    // this.uidisposables.dispose();
    return etch.update(this);
  };

  renderThumbs = () => {
    if (this.screens.length === 0) {
      return $.div({ className: "text-warning" }, "No screens found");
    }
    return this.screens.map(screen => {
      return $.div(
        {
          className: "css-thumb-wrapper",
          onClick: () => this.resolve(screen.id)
        },
        $.h4({ className: "css-thumb-title" }, screen.title),
        $.img({ className: "css-thumb", alt: screen.title, src: screen.thumb })
      );
    });
  };

  render = () => {
    return $.div(
      { className: "css-picker" },
      $.div(
        { className: "css-header" },
        $.h1({}, "Select desktop or window to record"),
        $.div({
          className: "icon icon-x css-close",
          onClick: () => this.hide() && this.reject()
        })
      ),
      $.div({ className: "css-thumbs" }, ...this.renderThumbs())
    );
  };

  getModalPanel = () => {
    if (!this.modalPanel) {
      this.modalPanel = atom.workspace.addModalPanel({ item: this.element });
      this.disposables.add(new Disposable(() => this.modalPanel.destroy()));
    }
    return this.modalPanel;
  };

  destroy = () => this.disposables.dispose();
}
