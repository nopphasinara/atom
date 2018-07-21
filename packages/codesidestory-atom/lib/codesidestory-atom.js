import { CompositeDisposable, Disposable } from "atom";
import remote from "remote";
import _get from "lodash.get";
import jwt_decode from "jwt-decode";
import { fbKeyEncode, fbKeyDecode, repoIdForPath, getSiteUrl } from "./helpers";
import RepoSettingsView from "./repo-settings-view";
import ConversationsGutter from "./conversations-gutter";
import * as firebase from "firebase/app";
import AutoCompleteProvider from "./autocomplete-provider";
import { destroyScreenRecorder } from "./screen/screen-recorder";

// These imports load individual services into the firebase namespace.
import "firebase/auth";
import "firebase/database-node";

import etch from "etch";
const $ = etch.dom;

const BrowserWindow = remote.require("browser-window");

module.exports = {
  subscriptions: null,
  gutter: null,

  config: {
    siteUrl: {
      type: "string",
      default: "https://codesidestory.com"
    },
    firebase: {
      type: "object",
      properties: {
        apiKey: {
          type: "string",
          default: "AIzaSyDl666AqnErZFcXD4H_XRbV_cBc8PvFImk"
        },
        authDomain: {
          default: "codesidestory-1.firebaseapp.com",
          type: "string"
        },
        databaseURL: {
          default: "https://codesidestory-1.firebaseio.com",
          type: "string"
        },
        projectId: {
          default: "codesidestory-1",
          type: "string"
        },
        storageBucket: {
          default: "codesidestory-1.appspot.com",
          type: "string"
        },
        messagingSenderId: {
          type: "string",
          default: "485659103520"
        }
      }
    }
  },

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.state = state || {};

    // Have separate subscriptions for logout and login state.
    this.subscriptions = new CompositeDisposable();
    this.loginsubs = new CompositeDisposable();
    this.logoutsubs = new CompositeDisposable();
    this.subscriptions.add(this.loginsubs, this.logoutsubs);

    this.autoCompleteProvider = new AutoCompleteProvider();

    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "codesidestory:init": () => (this.user ? this.init(true) : this.login())
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
    if (this.repoSettingsView) {
      this.repoSettingsView.destroy();
    }
    destroyScreenRecorder();
  },

  serialize() {
    return this.state;
  },

  getProviders() {
    return [this.autoCompleteProvider];
  },

  login() {
    if (firebase.apps.length) {
      this.auth();
      return;
    }

    const firebaseConfig = atom.config.get("codesidestory-atom.firebase");
    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.logoutsubs.dispose();

        user.getIdToken().then(tok => {
          const { team_id } = jwt_decode(tok) || {};
          if (!team_id) {
            return console.error("No team_id found for user ", user.uid);
          }
          const userTeam = { user_id: user.uid, team_id };

          this.user = userTeam;
          this.init();

          this.loginsubs.add(
            atom.workspace.observeActiveTextEditor(
              this.onEditorActive.bind(this)
            )
          );

          this.loginsubs.add(
            atom.commands.add("atom-workspace", {
              "codesidestory:repo-settings": () => this.init(true)
            }),
            atom.contextMenu.add({
              "atom-workspace": [
                {
                  label: "CodeSideStory",
                  submenu: [
                    {
                      label: "Repo Settings",
                      command: "codesidestory:repo-settings"
                    }
                  ]
                }
              ]
            })
          );
        });
        this.loginsubs.add(
          atom.commands.add("atom-workspace", {
            "codesidestory:logout": () => firebase.auth().signOut()
          })
        );
      } else {
        this.loginsubs.dispose();

        this.logoutsubs.add(
          atom.commands.add("atom-workspace", {
            "codesidestory:login": () => this.login()
          })
        );

        this.auth();
      }
    });
  },

  init(showRepoSetting) {
    const { team_id } = this.user;
    this.teamRef = firebase.database().ref(`teams/${team_id}`);

    this.autoCompleteProvider.init(this.teamRef.child("users"));

    this.getRepos()
      .then(repos => {
        // all projects have repo id and repo channel.
        const uninitialiedRepos = repos.find(repo => {
          return !repo || !repo.id || !repo.channel;
        });
        if (uninitialiedRepos || showRepoSetting) {
          this.initRepoSettingsView(repos);
        } else {
          this.modalPanel = atom.workspace.addBottomPanel({
            item: etch.render(
              $.div(
                {
                  className: "block css-bottom-panel text-info",
                  onClick: () => this.modalPanel.destroy()
                },
                $.div({ className: "css-close icon icon-x pull-right" }),
                'CodeSideStory initialized! Use "Codesidestory:Start Conversation" in Command Palette to start a conversation'
              )
            ),
            visible: true
          });
        }
      })
      .catch(console.error);
  },

  onEditorActive(editor) {
    if (!editor) {
      return;
    }
    const [projectPath, filePath] = atom.project.relativizePath(
      editor.getPath()
    );
    const repoId = repoIdForPath(editor.getPath(), this.state.repos);
    if (!repoId) {
      console.warn("Not able to find repo for file: ", filePath);
      this.init(true);
      return;
    }
    const fileRef = this.teamRef.child(
      `repos/${repoId}/files/${fbKeyEncode(filePath)}`
    );

    if (this.gutter) {
      this.gutter.destroy();
    }

    this.teamRef
      .child(`repoIds/${repoId}/channel/id`)
      .once("value")
      .then(snap => {
        const channelId = snap.val();
        if (!channelId) {
          // TODO: Prompt user to add channel.
          console.warn("No channles setup for repo");
          return;
        }
        this.gutter = new ConversationsGutter({ editor, fileRef, channelId });
        this.loginsubs.add(
          new Disposable(() => this.gutter && this.gutter.destroy())
        );
      });
  },

  getRepos() {
    const savedRepos = this.state.repos || [];
    return Promise.all(
      atom.project
        .getRepositories()
        .map(
          (repo, idx) =>
            repo && repo.getOriginURL() ? repo.getOriginURL() : savedRepos[idx]
        )
        .map(
          url =>
            url
              ? this.teamRef
                  .child(`repoIds/${fbKeyEncode(url)}`)
                  .once("value")
                  .then(snap => snap.val() || { id: fbKeyEncode(url), url })
              : Promise.resolve({})
        )
    );
  },

  showRepoSettings(repos, channels) {
    if (this.repoSettingsView) {
      this.repoSettingsView.destroy();
    }
    this.teamRef
      .child("repoIds")
      .once("value")
      .then(snap => {
        const repoIds = snap.val() || {};
        this.repoSettingsView = new RepoSettingsView({
          repos,
          channels,
          repoIds: Object.keys(repoIds).map(key => repoIds[key]),
          onSave: this.onSave.bind(this)
        });
      })
      .catch(err => {
        console.error(err);
        this.repoSettingsView = new RepoSettingsView({
          repos,
          channels,
          repoIds: [],
          onSave: this.onSave.bind(this)
        });
      });
  },

  onSave({ repos }) {
    repos.forEach(repo =>
      this.teamRef.child(`repoIds/${repo.id}`).update(repo)
    );
    const paths = atom.project.getPaths();
    this.state.repos = repos.map(repo => repo.url);
    this.onEditorActive(atom.workspace.getActiveTextEditor());
  },

  initRepoSettingsView(repos) {
    this.teamRef
      .child("channels")
      .once("value")
      .then(snap => {
        const val = snap.val() || {};
        return Object.keys(val).map(key => val[key]);
      })
      .then(channels => this.showRepoSettings(repos, channels))
      .catch(console.error);
  },

  auth() {
    const win = new BrowserWindow({
      toolbar: true,
      //    width: 800,
      //    height: 550,
      show: false,
      "node-integration": false,
      "web-preferences": { javascript: true }
    });
    const siteUrl = getSiteUrl();
    const successUrl = `${siteUrl}/login/success`;
    const signInUrl = `${siteUrl}/login/atom`;
    win.loadURL(signInUrl);
    win.once("ready-to-show", () => win.show());

    win.webContents.on("did-get-redirect-request", (event, oldUrl, url) => {
      if (url.indexOf(successUrl) === 0) {
        const token = url.substring(successUrl.length + 1); // +1 for slash
        firebase.auth().signInWithCustomToken(token).catch(console.error);
      }
    });
    win.webContents.on("did-finish-load", () => {
      win.webContents.executeJavaScript("window.isInsideAtom=true;");
    });
  }
};
