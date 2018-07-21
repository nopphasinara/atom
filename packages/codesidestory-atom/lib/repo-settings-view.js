import { Disposable, CompositeDisposable, TextEditor } from "atom";
import etch from "etch";
import { fbKeyEncode } from "./helpers";

const $ = etch.dom;

export default class RepoSettingsView {
  constructor(props) {
    this.props = props;

    this.disposables = new CompositeDisposable();

    this.showRepoList = this.props.repos.map(repo => !repo.url);
    this.rootPaths = atom.project.getPaths();

    etch.initialize(this);
    this.disposables.add(new Disposable(() => etch.destroy(this)));

    this.writeAfterUpdate();
    this.getModalPanel().show();
  }

  attachEvents = () => {
    this.refs.close.addEventListener("click", this.destroy);
    this.refs.cancel.addEventListener("click", this.destroy);
    this.refs.save.addEventListener("click", this.onSave);
    this.uidisposables.add(
      new Disposable(() => {
        this.refs.close.removeEventListener("click", this.destroy);
        this.refs.cancel.removeEventListener("click", this.destroy);
        this.refs.save.removeEventListener("click", this.onSave);
      })
    );
  };

  onClose = () => {
    this.getModalPanel().hide();
  };

  onSave = () => {
    if (this.refs.save.classList.contains("disabled")) {
      return;
    }
    if (this.props.onSave) {
      const { repos, channels } = this.props;
      this.props.onSave({ repos, channels });
    }
    this.destroy();
  };

  update = () => {
    this.uidisposables.dispose();
    return etch.update(this);
  };

  render = () => {
    return $.div(
      {},
      this.renderModalHeader(),
      this.renderRepos(),
      this.renderAction()
    );
  };

  renderChannelList = (repo, idx) => {
    const { channels } = this.props;

    if (!channels || channels.length === 0) {
      return $.div(
        {},
        "No channels setup. See https://codesidestory.com/setup"
      );
    }
    const channelOptions = [
      $.option({ className: "text-warning", value: "" }, "Select channel")
    ];
    const currChId = repo.channel ? repo.channel.id : null;
    channels.forEach(ch =>
      channelOptions.push(
        $.option(
          ch.id === currChId
            ? { selected: "selected", value: ch.id }
            : { value: ch.id },
          ch.name
        )
      )
    );

    return $.select(
      {
        className: "input-select",
        onChange: e => {
          const chId = e.target.value;
          if (!chId) {
            return;
          }
          const channel = channels.find(ch => ch.id === chId);
          this.props.repos = this.props.repos.map(
            (repo, i) => (i === idx ? { ...repo, channel } : repo)
          );
          this.update();
        }
      },
      ...channelOptions
    );
  };

  renderModalHeader = () => {
    return $.div(
      { className: "css-header" },
      $.h1({}, "Repo Settings"),
      $.div({ className: "icon icon-x css-close", ref: "close" })
    );
  };

  renderChannel = (channel, idx) => {
    if (!channel) {
      return $.span({ className: "text-warning" }, "None selected");
    }
    return $.span({ className: "text-success" }, `#${channel.name}`);
  };

  writeAfterUpdate = () => {
    const { repos } = this.props;
    this.uidisposables = new CompositeDisposable();
    this.disposables.add(this.uidisposables);

    this.attachEvents();

    repos.forEach((repo, idx) => {
      const repoInput = this.refs[`repo${idx}`];
      const list = this.refs[`list${idx}`];
      if (repoInput) {
        this.uidisposables.add(
          repoInput.onDidStopChanging(e => {
            repo.url = repoInput.getText();
            repo.id = fbKeyEncode(repoInput.getText());
            this.update();
          })
        );
      }
      if (!repo.channel || !this.refs[`list${idx}`]) {
        return;
      }
      const chIdx = this.props.channels.findIndex(
        ch => ch.id === repo.channel.id
      );
      if (chIdx === -1) {
        return;
      }
      this.refs[`list${idx}`] && this.refs[`list${idx}`].selectIndex(chIdx);
    });
  };

  renderRepoList = idx => {
    const { repoIds } = this.props;
    const currRepo = this.props.repos[idx] || {};
    const picked = repoIds.find(r => r.url === currRepo.url);
    return $.select(
      {
        className: "input-select",
        onChange: e => {
          const url = e.target.value;
          if (!url) {
            return;
          }
          const inp = this.refs[`repo${idx}`];
          const repo = this.props.repoIds.find(rp => rp.url === url);
          this.props.repos[idx] = { ...repo };
          if (inp) {
            inp.setText(repo.url);
          }
          this.update();
        }
      },
      $.option(
        picked ? { value: "" } : { value: "", selected: "selected" },
        "Select Existing Repo"
      ),
      ...repoIds.map(repo => $.option({ value: repo.url }, repo.url))
    );
  };

  renderRepo = (repo, idx) => {
    const showList = !repo.channel || this.showList;
    const showRepoList =
      this.showRepoList[idx] && this.props.repoIds.length > 0;

    return $.li(
      { className: "list-item padded css-item" },
      $.h4({}, `Project: ${this.rootPaths[idx]}`),
      $.div(
        { className: "css-line css-repo" },
        this.showRepoList[idx]
          ? $(TextEditor, {
              mini: true,
              ref: `repo${idx}`,
              placeholderText: "Enter new repo url or select from list below"
            })
          : $.div(
              { className: "css-line-item" },
              $.span({}, "Repo : "),
              $.span({ className: "text-success" }, repo.url)
            ),
        showRepoList ? this.renderRepoList(idx) : null
      ),
      $.div(
        { className: "css-line" },
        $.div(
          { className: "css-line-item" },
          "Slack channel for repo: ",
          this.renderChannelList(repo, idx)
        )
      )
    );
  };

  renderRepos = () => {
    return $.ul(
      { className: "list-group css-repo-list" },
      ...this.props.repos.map(this.renderRepo)
    );
  };

  renderAction = () => {
    const disabled = !!this.props.repos.find(
      (repo, idx) => !repo.channel || !repo.url
    );
    return $.div(
      { className: "css-action" },
      $.div(
        { className: "text-info" },
        'Use command palette "CodeSideStory:Repo Setting" to return to this dialog'
      ),
      $.button(
        {
          className: "btn css-margin-right",
          ref: "cancel"
        },
        "Cancel"
      ),
      $.button(
        {
          className: `btn btn-primary`,
          ref: "save"
        },
        "Save"
      )
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
