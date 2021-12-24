// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __param = void 0 && (void 0).__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const crypto_1 = require("crypto");

const fileSystem = require("fs");

const fs = require("fs-extra");

const glob = require("glob");

const inversify_1 = require("inversify");

const path = require("path");

const tmp = require("tmp");

const async_1 = require("../utils/async");

const types_1 = require("./types");

let FileSystem = class FileSystem {
  constructor(platformService) {
    this.platformService = platformService;
  }

  get directorySeparatorChar() {
    return path.sep;
  }

  objectExists(filePath, statCheck) {
    return new Promise(resolve => {
      fs.stat(filePath, (error, stats) => {
        if (error) {
          return resolve(false);
        }

        return resolve(statCheck(stats));
      });
    });
  }

  fileExists(filePath) {
    return this.objectExists(filePath, stats => stats.isFile());
  }

  fileExistsSync(filePath) {
    return fs.existsSync(filePath);
  }
  /**
   * Reads the contents of the file using utf8 and returns the string contents.
   * @param {string} filePath
   * @returns {Promise<string>}
   * @memberof FileSystem
   */


  readFile(filePath) {
    return fs.readFile(filePath).then(buffer => buffer.toString());
  }

  writeFile(filePath, data) {
    return __awaiter(this, void 0, void 0, function* () {
      yield fs.writeFile(filePath, data, {
        encoding: 'utf8'
      });
    });
  }

  directoryExists(filePath) {
    return this.objectExists(filePath, stats => stats.isDirectory());
  }

  createDirectory(directoryPath) {
    return fs.mkdirp(directoryPath);
  }

  getSubDirectories(rootDir) {
    return new Promise(resolve => {
      fs.readdir(rootDir, (error, files) => {
        if (error) {
          return resolve([]);
        }

        const subDirs = [];
        files.forEach(name => {
          const fullPath = path.join(rootDir, name);

          try {
            if (fs.statSync(fullPath).isDirectory()) {
              subDirs.push(fullPath);
            } // tslint:disable-next-line:no-empty

          } catch (ex) {}
        });
        resolve(subDirs);
      });
    });
  }

  arePathsSame(path1, path2) {
    path1 = path.normalize(path1);
    path2 = path.normalize(path2);

    if (this.platformService.isWindows) {
      return path1.toUpperCase() === path2.toUpperCase();
    } else {
      return path1 === path2;
    }
  }

  appendFileSync(filename, data, optionsOrEncoding) {
    return fs.appendFileSync(filename, data, optionsOrEncoding);
  }

  getRealPath(filePath) {
    return new Promise(resolve => {
      fs.realpath(filePath, (err, realPath) => {
        resolve(err ? filePath : realPath);
      });
    });
  }

  copyFile(src, dest) {
    const deferred = async_1.createDeferred();
    const rs = fs.createReadStream(src).on('error', err => {
      deferred.reject(err);
    });
    const ws = fs.createWriteStream(dest).on('error', err => {
      deferred.reject(err);
    }).on('close', () => {
      deferred.resolve();
    });
    rs.pipe(ws);
    return deferred.promise;
  }

  deleteFile(filename) {
    const deferred = async_1.createDeferred();
    fs.unlink(filename, err => err ? deferred.reject(err) : deferred.resolve());
    return deferred.promise;
  }

  getFileHash(filePath) {
    return new Promise(resolve => {
      fs.lstat(filePath, (err, stats) => {
        if (err) {
          resolve();
        } else {
          const actual = crypto_1.createHash('sha512').update(`${stats.ctimeMs}-${stats.mtimeMs}`).digest('hex');
          resolve(actual);
        }
      });
    });
  }

  search(globPattern) {
    return new Promise((resolve, reject) => {
      glob(globPattern, (ex, files) => {
        if (ex) {
          return reject(ex);
        }

        resolve(Array.isArray(files) ? files : []);
      });
    });
  }

  createTemporaryFile(extension) {
    return new Promise((resolve, reject) => {
      tmp.file({
        postfix: extension
      }, (err, tmpFile, _, cleanupCallback) => {
        if (err) {
          return reject(err);
        }

        resolve({
          filePath: tmpFile,
          dispose: cleanupCallback
        });
      });
    });
  }

  createWriteStream(filePath) {
    return fileSystem.createWriteStream(filePath);
  }

  chmod(filePath, mode) {
    return new Promise((resolve, reject) => {
      fileSystem.chmod(filePath, mode, err => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

};
FileSystem = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_1.IPlatformService))], FileSystem);
exports.FileSystem = FileSystem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGVTeXN0ZW0uanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImRlY29yYXRvcnMiLCJ0YXJnZXQiLCJrZXkiLCJkZXNjIiwiYyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInIiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkIiwiUmVmbGVjdCIsImRlY29yYXRlIiwiaSIsImRlZmluZVByb3BlcnR5IiwiX19wYXJhbSIsInBhcmFtSW5kZXgiLCJkZWNvcmF0b3IiLCJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiZXhwb3J0cyIsImNyeXB0b18xIiwicmVxdWlyZSIsImZpbGVTeXN0ZW0iLCJmcyIsImdsb2IiLCJpbnZlcnNpZnlfMSIsInBhdGgiLCJ0bXAiLCJhc3luY18xIiwidHlwZXNfMSIsIkZpbGVTeXN0ZW0iLCJjb25zdHJ1Y3RvciIsInBsYXRmb3JtU2VydmljZSIsImRpcmVjdG9yeVNlcGFyYXRvckNoYXIiLCJzZXAiLCJvYmplY3RFeGlzdHMiLCJmaWxlUGF0aCIsInN0YXRDaGVjayIsInN0YXQiLCJlcnJvciIsInN0YXRzIiwiZmlsZUV4aXN0cyIsImlzRmlsZSIsImZpbGVFeGlzdHNTeW5jIiwiZXhpc3RzU3luYyIsInJlYWRGaWxlIiwiYnVmZmVyIiwidG9TdHJpbmciLCJ3cml0ZUZpbGUiLCJkYXRhIiwiZW5jb2RpbmciLCJkaXJlY3RvcnlFeGlzdHMiLCJpc0RpcmVjdG9yeSIsImNyZWF0ZURpcmVjdG9yeSIsImRpcmVjdG9yeVBhdGgiLCJta2RpcnAiLCJnZXRTdWJEaXJlY3RvcmllcyIsInJvb3REaXIiLCJyZWFkZGlyIiwiZmlsZXMiLCJzdWJEaXJzIiwiZm9yRWFjaCIsIm5hbWUiLCJmdWxsUGF0aCIsImpvaW4iLCJzdGF0U3luYyIsInB1c2giLCJleCIsImFyZVBhdGhzU2FtZSIsInBhdGgxIiwicGF0aDIiLCJub3JtYWxpemUiLCJpc1dpbmRvd3MiLCJ0b1VwcGVyQ2FzZSIsImFwcGVuZEZpbGVTeW5jIiwiZmlsZW5hbWUiLCJvcHRpb25zT3JFbmNvZGluZyIsImdldFJlYWxQYXRoIiwicmVhbHBhdGgiLCJlcnIiLCJyZWFsUGF0aCIsImNvcHlGaWxlIiwic3JjIiwiZGVzdCIsImRlZmVycmVkIiwiY3JlYXRlRGVmZXJyZWQiLCJycyIsImNyZWF0ZVJlYWRTdHJlYW0iLCJvbiIsIndzIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJwaXBlIiwicHJvbWlzZSIsImRlbGV0ZUZpbGUiLCJ1bmxpbmsiLCJnZXRGaWxlSGFzaCIsImxzdGF0IiwiYWN0dWFsIiwiY3JlYXRlSGFzaCIsInVwZGF0ZSIsImN0aW1lTXMiLCJtdGltZU1zIiwiZGlnZXN0Iiwic2VhcmNoIiwiZ2xvYlBhdHRlcm4iLCJBcnJheSIsImlzQXJyYXkiLCJjcmVhdGVUZW1wb3JhcnlGaWxlIiwiZXh0ZW5zaW9uIiwiZmlsZSIsInBvc3RmaXgiLCJ0bXBGaWxlIiwiXyIsImNsZWFudXBDYWxsYmFjayIsImRpc3Bvc2UiLCJjaG1vZCIsIm1vZGUiLCJpbmplY3RhYmxlIiwiaW5qZWN0IiwiSVBsYXRmb3JtU2VydmljZSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUNBLElBQUlBLFVBQVUsR0FBSSxVQUFRLFNBQUtBLFVBQWQsSUFBNkIsVUFBVUMsVUFBVixFQUFzQkMsTUFBdEIsRUFBOEJDLEdBQTlCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUNuRixNQUFJQyxDQUFDLEdBQUdDLFNBQVMsQ0FBQ0MsTUFBbEI7QUFBQSxNQUEwQkMsQ0FBQyxHQUFHSCxDQUFDLEdBQUcsQ0FBSixHQUFRSCxNQUFSLEdBQWlCRSxJQUFJLEtBQUssSUFBVCxHQUFnQkEsSUFBSSxHQUFHSyxNQUFNLENBQUNDLHdCQUFQLENB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QUFDdUUsR0FBRCxDQUFiO0FBQ0g7O0FBQ0R4RSxRQUFBQSxPQUFPO0FBQ1YsT0FMRDtBQU1ILEtBUE0sQ0FBUDtBQVFIOztBQW5KNkIsQ0FBbEM7QUFxSkF1QixVQUFVLEdBQUdoRCxVQUFVLENBQUMsQ0FDcEIyQyxXQUFXLENBQUM0RixVQUFaLEVBRG9CLEVBRXBCdkgsT0FBTyxDQUFDLENBQUQsRUFBSTJCLFdBQVcsQ0FBQzZGLE1BQVosQ0FBbUJ6RixPQUFPLENBQUMwRixnQkFBM0IsQ0FBSixDQUZhLENBQUQsRUFHcEJ6RixVQUhvQixDQUF2QjtBQUlBWCxPQUFPLENBQUNXLFVBQVIsR0FBcUJBLFVBQXJCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4ndXNlIHN0cmljdCc7XG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG52YXIgX19wYXJhbSA9ICh0aGlzICYmIHRoaXMuX19wYXJhbSkgfHwgZnVuY3Rpb24gKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY3J5cHRvXzEgPSByZXF1aXJlKFwiY3J5cHRvXCIpO1xuY29uc3QgZmlsZVN5c3RlbSA9IHJlcXVpcmUoXCJmc1wiKTtcbmNvbnN0IGZzID0gcmVxdWlyZShcImZzLWV4dHJhXCIpO1xuY29uc3QgZ2xvYiA9IHJlcXVpcmUoXCJnbG9iXCIpO1xuY29uc3QgaW52ZXJzaWZ5XzEgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuY29uc3QgdG1wID0gcmVxdWlyZShcInRtcFwiKTtcbmNvbnN0IGFzeW5jXzEgPSByZXF1aXJlKFwiLi4vdXRpbHMvYXN5bmNcIik7XG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG5sZXQgRmlsZVN5c3RlbSA9IGNsYXNzIEZpbGVTeXN0ZW0ge1xuICAgIGNvbnN0cnVjdG9yKHBsYXRmb3JtU2VydmljZSkge1xuICAgICAgICB0aGlzLnBsYXRmb3JtU2VydmljZSA9IHBsYXRmb3JtU2VydmljZTtcbiAgICB9XG4gICAgZ2V0IGRpcmVjdG9yeVNlcGFyYXRvckNoYXIoKSB7XG4gICAgICAgIHJldHVybiBwYXRoLnNlcDtcbiAgICB9XG4gICAgb2JqZWN0RXhpc3RzKGZpbGVQYXRoLCBzdGF0Q2hlY2spIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgZnMuc3RhdChmaWxlUGF0aCwgKGVycm9yLCBzdGF0cykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHN0YXRDaGVjayhzdGF0cykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmaWxlRXhpc3RzKGZpbGVQYXRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9iamVjdEV4aXN0cyhmaWxlUGF0aCwgKHN0YXRzKSA9PiBzdGF0cy5pc0ZpbGUoKSk7XG4gICAgfVxuICAgIGZpbGVFeGlzdHNTeW5jKGZpbGVQYXRoKSB7XG4gICAgICAgIHJldHVybiBmcy5leGlzdHNTeW5jKGZpbGVQYXRoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVhZHMgdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIHVzaW5nIHV0ZjggYW5kIHJldHVybnMgdGhlIHN0cmluZyBjb250ZW50cy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGhcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxzdHJpbmc+fVxuICAgICAqIEBtZW1iZXJvZiBGaWxlU3lzdGVtXG4gICAgICovXG4gICAgcmVhZEZpbGUoZmlsZVBhdGgpIHtcbiAgICAgICAgcmV0dXJuIGZzLnJlYWRGaWxlKGZpbGVQYXRoKS50aGVuKGJ1ZmZlciA9PiBidWZmZXIudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHdyaXRlRmlsZShmaWxlUGF0aCwgZGF0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgZnMud3JpdGVGaWxlKGZpbGVQYXRoLCBkYXRhLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkaXJlY3RvcnlFeGlzdHMoZmlsZVBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0RXhpc3RzKGZpbGVQYXRoLCAoc3RhdHMpID0+IHN0YXRzLmlzRGlyZWN0b3J5KCkpO1xuICAgIH1cbiAgICBjcmVhdGVEaXJlY3RvcnkoZGlyZWN0b3J5UGF0aCkge1xuICAgICAgICByZXR1cm4gZnMubWtkaXJwKGRpcmVjdG9yeVBhdGgpO1xuICAgIH1cbiAgICBnZXRTdWJEaXJlY3Rvcmllcyhyb290RGlyKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGZzLnJlYWRkaXIocm9vdERpciwgKGVycm9yLCBmaWxlcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHN1YkRpcnMgPSBbXTtcbiAgICAgICAgICAgICAgICBmaWxlcy5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihyb290RGlyLCBuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmcy5zdGF0U3luYyhmdWxsUGF0aCkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YkRpcnMucHVzaChmdWxsUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXgpIHsgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoc3ViRGlycyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFyZVBhdGhzU2FtZShwYXRoMSwgcGF0aDIpIHtcbiAgICAgICAgcGF0aDEgPSBwYXRoLm5vcm1hbGl6ZShwYXRoMSk7XG4gICAgICAgIHBhdGgyID0gcGF0aC5ub3JtYWxpemUocGF0aDIpO1xuICAgICAgICBpZiAodGhpcy5wbGF0Zm9ybVNlcnZpY2UuaXNXaW5kb3dzKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aDEudG9VcHBlckNhc2UoKSA9PT0gcGF0aDIudG9VcHBlckNhc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoMSA9PT0gcGF0aDI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXBwZW5kRmlsZVN5bmMoZmlsZW5hbWUsIGRhdGEsIG9wdGlvbnNPckVuY29kaW5nKSB7XG4gICAgICAgIHJldHVybiBmcy5hcHBlbmRGaWxlU3luYyhmaWxlbmFtZSwgZGF0YSwgb3B0aW9uc09yRW5jb2RpbmcpO1xuICAgIH1cbiAgICBnZXRSZWFsUGF0aChmaWxlUGF0aCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBmcy5yZWFscGF0aChmaWxlUGF0aCwgKGVyciwgcmVhbFBhdGgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGVyciA/IGZpbGVQYXRoIDogcmVhbFBhdGgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb3B5RmlsZShzcmMsIGRlc3QpIHtcbiAgICAgICAgY29uc3QgZGVmZXJyZWQgPSBhc3luY18xLmNyZWF0ZURlZmVycmVkKCk7XG4gICAgICAgIGNvbnN0IHJzID0gZnMuY3JlYXRlUmVhZFN0cmVhbShzcmMpLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgd3MgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShkZXN0KS5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgICAgfSkub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcnMucGlwZSh3cyk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH1cbiAgICBkZWxldGVGaWxlKGZpbGVuYW1lKSB7XG4gICAgICAgIGNvbnN0IGRlZmVycmVkID0gYXN5bmNfMS5jcmVhdGVEZWZlcnJlZCgpO1xuICAgICAgICBmcy51bmxpbmsoZmlsZW5hbWUsIGVyciA9PiBlcnIgPyBkZWZlcnJlZC5yZWplY3QoZXJyKSA6IGRlZmVycmVkLnJlc29sdmUoKSk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH1cbiAgICBnZXRGaWxlSGFzaChmaWxlUGF0aCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBmcy5sc3RhdChmaWxlUGF0aCwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdHVhbCA9IGNyeXB0b18xLmNyZWF0ZUhhc2goJ3NoYTUxMicpLnVwZGF0ZShgJHtzdGF0cy5jdGltZU1zfS0ke3N0YXRzLm10aW1lTXN9YCkuZGlnZXN0KCdoZXgnKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhY3R1YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2VhcmNoKGdsb2JQYXR0ZXJuKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBnbG9iKGdsb2JQYXR0ZXJuLCAoZXgsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNvbHZlKEFycmF5LmlzQXJyYXkoZmlsZXMpID8gZmlsZXMgOiBbXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNyZWF0ZVRlbXBvcmFyeUZpbGUoZXh0ZW5zaW9uKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0bXAuZmlsZSh7IHBvc3RmaXg6IGV4dGVuc2lvbiB9LCAoZXJyLCB0bXBGaWxlLCBfLCBjbGVhbnVwQ2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IGZpbGVQYXRoOiB0bXBGaWxlLCBkaXNwb3NlOiBjbGVhbnVwQ2FsbGJhY2sgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVQYXRoKSB7XG4gICAgICAgIHJldHVybiBmaWxlU3lzdGVtLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVQYXRoKTtcbiAgICB9XG4gICAgY2htb2QoZmlsZVBhdGgsIG1vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW0uY2htb2QoZmlsZVBhdGgsIG1vZGUsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5GaWxlU3lzdGVtID0gX19kZWNvcmF0ZShbXG4gICAgaW52ZXJzaWZ5XzEuaW5qZWN0YWJsZSgpLFxuICAgIF9fcGFyYW0oMCwgaW52ZXJzaWZ5XzEuaW5qZWN0KHR5cGVzXzEuSVBsYXRmb3JtU2VydmljZSkpXG5dLCBGaWxlU3lzdGVtKTtcbmV4cG9ydHMuRmlsZVN5c3RlbSA9IEZpbGVTeXN0ZW07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWxlU3lzdGVtLmpzLm1hcCJdfQ==