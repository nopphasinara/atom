import ScreenPicker from "./screen-picker";
import ScreenPreivew from "./screen-preview";
import { getSiteUrl } from "../helpers";
import etch from "etch";
import fs from "fs";
import os from "os";
import path from "path";

import * as firebase from "firebase/app";
import "firebase/storage";

const $ = etch.dom;
const MIME_TYPE = "video/webm";

const states = {
  NOT_RECORDING: "NOT_RECORDING",
  RECORDING: "RECORDING",
  STOPPED: "STOPPED",
  UPLOADING: "UPLOADING"
};

const recording = {
  state: states.NOT_RECORDING,
  chunks: [],
  url: "",
  recorder: null,
  tmpFile: "",
  progress: 0,
  tracks: []
};

function resetRecording() {
  recording.state = states.NOT_RECORDING;
  recording.chunks = [];
  recording.url = "";

  if (recording.recorder) {
    try {
      recording.recorder.stop();
    } catch (err) {
      console.error(err);
    }
  }
  recording.recorder = null;

  if (recording.tracks && recording.tracks.length > 0) {
    recording.tracks.forEach(track => {
      try {
        track.stop();
      } catch (err) {
        console.error(err);
      }
    });
  }
  recording.tracks = [];

  if (recording.tmpFile) {
    fs.unlink(recording.tmpFile, () => {});
  }
  recording.tmpFile = "";

  recording.progress = 0;
}

function toArrayBuffer(blob, cb) {
  let fileReader = new FileReader();
  fileReader.onload = function() {
    let arrayBuffer = this.result;
    cb(arrayBuffer);
  };
  fileReader.readAsArrayBuffer(blob);
}

function toBuffer(ab) {
  let buffer = new Buffer(ab.byteLength);
  let arr = new Uint8Array(ab);
  for (let i = 0; i < arr.byteLength; i++) {
    buffer[i] = arr[i];
  }
  return buffer;
}

function chunksToBuffer(chunks, cb) {
  const blob = new Blob(chunks, { type: MIME_TYPE });
  toArrayBuffer(blob, ab => cb(toBuffer(ab)));
}

class ScreenRecorder {
  constructor(url, update, onSend) {
    this.setProps(url, update, onSend);
  }

  setProps = (url, update, onSend) => {
    this.url = url;
    this.update = update;
    this.onSend = onSend;
  };

  pickScreen = () => {
    resetRecording();
    if (!this.screenPicker) {
      this.screenPicker = new ScreenPicker();
    }
    this.screenPicker.show().then(sourceId => {
      this.screenPicker.hide();
      this.sourceId = sourceId;
      recording.state = states.RECORDING;
      this.startRecording();
    });
  };

  previewRecording = () => {
    if (!this.preview) {
      this.preview = new ScreenPreivew();
    }
    this.preview.show(recording.tmpFile);
  };

  discardRecording = () => {
    fs.unlink(recording.tmpFile, err => {
      if (err) {
        console.error(err);
      }
      resetRecording();
      this.update();
    });
  };

  startRecording = () => {
    navigator.webkitGetUserMedia(
      {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: this.sourceId,
            minWidth: 800,
            maxWidth: 1280,
            minHeight: 600,
            maxHeight: 720
          }
        }
      },
      this.handleStream,
      this.handleUserMediaError
    );
  };

  stopTracks = () => {
    recording.tracks.forEach(track => {
      try {
        track.stop();
      } catch (err) {
        console.error(err);
      }
    });
    recording.tracks = [];
  };

  stopRecording = () => {
    const recorder = recording.recorder;
    if (!recorder) {
      return;
    }
    recorder.stop();
    this.stopTracks();
    recording.recorder = null;
    chunksToBuffer(recording.chunks, buff => {
      recording.chunks = [];
      fs.writeFile(recording.tmpFile, buff, err => {
        if (err) {
          console.error("Failed to save video " + err);
          resetRecording();
          return this.update();
        }
        recording.state = states.STOPPED;
        this.update();
      });
    });
  };

  onUploadTask = (task, fileName) => {
    task.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          snapshot.bytesTransferred / snapshot.totalBytes * 100
        );
        recording.progress = progress;
        this.update();
      },
      error => {
        resetRecording();
        console.error(error);
        this.update();
      },
      () => {
        this.onSend(`Recording: ${getSiteUrl()}/video/${fileName}`);
        this.discardRecording();
      }
    );
  };

  uploadFle = () => {
    recording.state = states.UPLOADING;
    fs.readFile(recording.tmpFile, (err, data) => {
      if (err) {
        return console.error(err);
      }
      const [, , , , team_id] = this.url.split("/");
      const vdbRef = firebase.database().ref(`teams/${team_id}/videos`).push();
      const fileName = `${vdbRef.key}.webm`;
      const storage = `teams/${team_id}/videos/${fileName}`;
      const uploadTask = firebase
        .storage()
        .ref(storage)
        .put(data.buffer, { contentType: MIME_TYPE });
      this.onUploadTask(uploadTask, fileName);
      vdbRef.set({ storage });
    });
  };

  handleStream = stream => {
    const recorder = new MediaRecorder(stream);

    recording.chunks = [];
    recording.url = this.url;
    recording.tmpFile = path.join(os.tmpdir(), `css_${Date.now()}.webm`);
    this.update();

    recorder.ondataavailable = function(event) {
      recording.chunks.push(event.data);
    };
    recorder.start(1001);
    recording.recorder = recorder;
    recording.tracks = stream.getTracks();
  };

  handleUserMediaError = e => {
    console.error("handleUserMediaError", e);
    resetRecording();
    this.update();
  };

  getDom = () => {
    if (recording.state === states.NOT_RECORDING) {
      return $.a(
        {
          href: "#",
          className: "pull-right text-info",
          onClick: () => this.pickScreen()
        },
        "Record screen"
      );
    }
    if (recording.url === this.url) {
      switch (recording.state) {
        case states.RECORDING:
          return $.div(
            {},
            $.a(
              {
                href: "#",
                className: "pull-right text-warning",
                onClick: () => this.stopRecording()
              },
              "Stop recording"
            ),
            $.progress({ className: "pull-right css-recording" })
          );
          break;

        case states.STOPPED:
          return $.div(
            { className: "block" },
            $.a(
              {
                href: "#",
                className: "pull-right text-info",
                onClick: () => this.uploadFle()
              },
              "Upload"
            ),
            $.a(
              {
                href: "#",
                className: "pull-right text-warning css-margin-right",
                onClick: () => this.discardRecording()
              },
              "Discard"
            ),
            $.a(
              {
                href: "#",
                className: "pull-right text-subtle css-margin-right",
                onClick: () => this.previewRecording()
              },
              "Preview"
            )
          );
          break;

        case states.UPLOADING:
          return $.div(
            { className: "block" },
            $.progress({
              className: "css-progress pull-right",
              max: 100,
              value: recording.progress
            })
          );

        default:
      }
    }
    return null;
  };

  destroy = () => {
    if (this.screenPicker) {
      this.screenPicker.destroy();
    }
    if (this.preview) {
      this.preview.destroy();
    }
  };
}

const recorderMap = {};
export function getScreenRecorder(url, update, onSend) {
  if (recorderMap[url]) {
    recorderMap[url].setProps(url, update, onSend);
  } else {
    recorderMap[url] = new ScreenRecorder(url, update, onSend);
  }
  return recorderMap[url];
}

export function destroyScreenRecorder() {
  Object.keys(recorderMap).forEach(url => recorderMap[url].destroy());
}

export function getActiveRecorder(linesUrl) {
  if (recording.NOT_RECORDING) {
    return;
  }
  if (recording.url.indexOf(linesUrl) === -1) {
    return;
  }
  return parseInt(recording.url.split("/").pop(), 10);
}
