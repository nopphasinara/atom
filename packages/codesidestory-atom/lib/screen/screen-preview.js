import { CompositeDisposable, Disposable } from "atom";
import etch from "etch";
const $ = etch.dom;

export default class ScreenPreview {
  constructor(props) {
    this.props = props;
    this.disposables = new CompositeDisposable();
    this.uidisposables = new CompositeDisposable();
    this.disposables.add(this.uidisposables);

    etch.initialize(this);

    this.disposables.add(new Disposable(() => etch.destroy(this)));
  }

  show = src => {
    this.src = src;
    this.getModalPanel().show();
    this.update();
  };

  hide = () => {
    this.getModalPanel().hide();
  };

  update = () => {
    // this.uidisposables.dispose();
    return etch.update(this);
  };

  render = () => {
    return $.div(
      { className: "css-preview" },
      $.div(
        { className: "css-header" },
        $.h1({}, "Screen Recording Preview"),
        $.div({
          className: "icon icon-x css-close",
          onClick: () => this.hide() && this.reject()
        })
      ),
      this.src
        ? $.video({
            controls: true,
            autoplay: true,
            className: "css-video",
            src: `file://${this.src}`
          })
        : null
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
