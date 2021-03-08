function msgAfterTimeout(msg, who, timeout) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(`${msg} Hello ${who}!`);
    }, timeout);
  });
}

msgAfterTimeout("asds", "Foo", 3000).then(function (msg) {
  console.log(`done after 300ms:${msg}`);
});