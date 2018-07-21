import request from "superagent/lib/client";
import markdown from "light-markdown";

import * as firebase from "firebase/app";
// These imports load individual services into the firebase namespace.
import "firebase/auth";

export const fbKeyEncode = str => encodeURIComponent(str).replace(/\./g, "%2E");
export const fbKeyDecode = str => decodeURIComponent(str).replace("%2E", ".");

export const repoIdForPath = (goalPath, savedRepos) => {
  const idx = atom.project
    .getDirectories()
    .findIndex(dir => dir.contains(goalPath));
  if (idx === -1 || !savedRepos) {
    return null;
  }
  const url = savedRepos[idx];
  return url ? fbKeyEncode(url) : null;
};

export const getSiteUrl = () => {
  let siteUrl = atom.config.get("codesidestory-atom.siteUrl");
  if (siteUrl.lastIndexOf("/") === siteUrl.length - 1) {
    siteUrl = siteUrl.substring(0, siteUrl.length - 1);
  }
  return siteUrl;
};

export const postConversation = ({ ref, event }) => {
  const user = firebase.auth().currentUser;
  user.getIdToken().then(jwt => {
    const siteUrl = getSiteUrl();
    const payload = { ref, jwt, event };
    request
      .post(`${siteUrl}/api/chat/send`)
      .type("json")
      .accept("json")
      .send(payload)
      .then(() => {})
      .catch(console.error);
  });
};

const slackRegEx = /<(.*?)>/g;
const emojiRegEx = /:([a-z-_0-9]*?):/g;
const emojiMap = require("./unicode-emoji.json");
markdown.setFlavor("slack");
export const formatSlackMessages = msg => {
  if (!msg) {
    return "";
  }
  return markdown.toHtml(
    msg
      .replace(slackRegEx, function(str, match) {
        const [link, displayText] = match.split("|");
        if (displayText) {
          return `*${displayText}*`;
        }
        return link;
      })
      .replace(
        emojiRegEx,
        (str, match) => (emojiMap[match] ? ` ${emojiMap[match]} ` : str)
      )
  );
};

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;
export const formatAgo = event_ts => {
  const event_sec = parseInt(event_ts.split(".").shift(), 10);
  const now_sec = Math.round(Date.now() / 1000);
  const seconds = now_sec - event_sec;

  const [value, unit] = seconds < MINUTE
    ? [Math.round(seconds), "second"]
    : seconds < HOUR
      ? [Math.round(seconds / MINUTE), "minute"]
      : seconds < DAY
        ? [Math.round(seconds / HOUR), "hour"]
        : seconds < WEEK
          ? [Math.round(seconds / DAY), "day"]
          : seconds < MONTH
            ? [Math.round(seconds / WEEK), "week"]
            : seconds < YEAR
              ? [Math.round(seconds / MONTH), "month"]
              : [Math.round(seconds / YEAR), "year"];

  return `${value} ${unit} ago`;
};
