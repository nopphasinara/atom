"use strict"; // Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

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

const inversify_1 = require("inversify");

const types_1 = require("../../../ioc/types");

require("../../extensions");

const types_2 = require("../types");

const baseActivationProvider_1 = require("./baseActivationProvider");

let Bash = class Bash extends baseActivationProvider_1.BaseActivationCommandProvider {
  constructor(serviceContainer) {
    super(serviceContainer);
  }

  isShellSupported(targetShell) {
    return targetShell === types_2.TerminalShellType.bash || targetShell === types_2.TerminalShellType.gitbash || targetShell === types_2.TerminalShellType.wsl || targetShell === types_2.TerminalShellType.ksh || targetShell === types_2.TerminalShellType.zsh || targetShell === types_2.TerminalShellType.cshell || targetShell === types_2.TerminalShellType.tcshell || targetShell === types_2.TerminalShellType.fish;
  }

  getActivationCommandsForInterpreter(pythonPath, targetShell) {
    return __awaiter(this, void 0, void 0, function* () {
      const scriptFile = yield this.findScriptFile(pythonPath, this.getScriptsInOrderOfPreference(targetShell));

      if (!scriptFile) {
        return;
      }

      return [`source ${scriptFile.fileToCommandArgument()}`];
    });
  }

  getScriptsInOrderOfPreference(targetShell) {
    switch (targetShell) {
      case types_2.TerminalShellType.wsl:
      case types_2.TerminalShellType.ksh:
      case types_2.TerminalShellType.zsh:
      case types_2.TerminalShellType.gitbash:
      case types_2.TerminalShellType.bash:
        {
          return ['activate.sh', 'activate'];
        }

      case types_2.TerminalShellType.tcshell:
      case types_2.TerminalShellType.cshell:
        {
          return ['activate.csh'];
        }

      case types_2.TerminalShellType.fish:
        {
          return ['activate.fish'];
        }

      default:
        {
          return [];
        }
    }
  }

};
Bash = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_1.IServiceContainer))], Bash);
exports.Bash = Bash;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2guanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImRlY29yYXRvcnMiLCJ0YXJnZXQiLCJrZXkiLCJkZXNjIiwiYyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInIiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkIiwiUmVmbGVjdCIsImRlY29yYXRlIiwiaSIsImRlZmluZVByb3BlcnR5IiwiX19wYXJhbSIsInBhcmFtSW5kZXgiLCJkZWNvcmF0b3IiLCJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiZXhwb3J0cyIsImludmVyc2lmeV8xIiwicmVxdWlyZSIsInR5cGVzXzEiLCJ0eXBlc18yIiwiYmFzZUFjdGl2YXRpb25Qcm92aWRlcl8xIiwiQmFzaCIsIkJhc2VBY3RpdmF0aW9uQ29tbWFuZFByb3ZpZGVyIiwiY29uc3RydWN0b3IiLCJzZXJ2aWNlQ29udGFpbmVyIiwiaXNTaGVsbFN1cHBvcnRlZCIsInRhcmdldFNoZWxsIiwiVGVybWluYWxTaGVsbFR5cGUiLCJiYXNoIiwiZ2l0YmFzaCIsIndzbCIsImtzaCIsInpzaCIsImNzaGVsbCIsInRjc2hlbGwiLCJmaXNoIiwiZ2V0QWN0aXZhdGlvbkNvbW1hbmRzRm9ySW50ZXJwcmV0ZXIiLCJweXRob25QYXRoIiwic2NyaXB0RmlsZSIsImZpbmRTY3JpcHRGaWxlIiwiZ2V0U2NyaXB0c0luT3JkZXJPZlByZWZlcmVuY2UiLCJmaWxlVG9Db21tYW5kQXJndW1lbnQiLCJpbmplY3RhYmxlIiwiaW5qZWN0IiwiSVNlcnZpY2VDb250YWluZXIiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FDQTtBQUNBOztBQUNBLElBQUlBLFVBQVUsR0FBSSxVQUFR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LGlCQUFSLENBQTBCTSxNQUEvQjtBQUF1QztBQUNuQyxpQkFBTyxDQUFDLGNBQUQsQ0FBUDtBQUNIOztBQUNELFdBQUtkLE9BQU8sQ0FBQ1EsaUJBQVIsQ0FBMEJRLElBQS9CO0FBQXFDO0FBQ2pDLGlCQUFPLENBQUMsZUFBRCxDQUFQO0FBQ0g7O0FBQ0Q7QUFBUztBQUNMLGlCQUFPLEVBQVA7QUFDSDtBQWpCTDtBQW1CSDs7QUEzQ2dGLENBQXJGO0FBNkNBZCxJQUFJLEdBQUczQyxVQUFVLENBQUMsQ0FDZHNDLFdBQVcsQ0FBQzBCLFVBQVosRUFEYyxFQUVkaEQsT0FBTyxDQUFDLENBQUQsRUFBSXNCLFdBQVcsQ0FBQzJCLE1BQVosQ0FBbUJ6QixPQUFPLENBQUMwQixpQkFBM0IsQ0FBSixDQUZPLENBQUQsRUFHZHZCLElBSGMsQ0FBakI7QUFJQU4sT0FBTyxDQUFDTSxJQUFSLEdBQWVBLElBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xudmFyIF9fcGFyYW0gPSAodGhpcyAmJiB0aGlzLl9fcGFyYW0pIHx8IGZ1bmN0aW9uIChwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGludmVyc2lmeV8xID0gcmVxdWlyZShcImludmVyc2lmeVwiKTtcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vaW9jL3R5cGVzXCIpO1xucmVxdWlyZShcIi4uLy4uL2V4dGVuc2lvbnNcIik7XG5jb25zdCB0eXBlc18yID0gcmVxdWlyZShcIi4uL3R5cGVzXCIpO1xuY29uc3QgYmFzZUFjdGl2YXRpb25Qcm92aWRlcl8xID0gcmVxdWlyZShcIi4vYmFzZUFjdGl2YXRpb25Qcm92aWRlclwiKTtcbmxldCBCYXNoID0gY2xhc3MgQmFzaCBleHRlbmRzIGJhc2VBY3RpdmF0aW9uUHJvdmlkZXJfMS5CYXNlQWN0aXZhdGlvbkNvbW1hbmRQcm92aWRlciB7XG4gICAgY29uc3RydWN0b3Ioc2VydmljZUNvbnRhaW5lcikge1xuICAgICAgICBzdXBlcihzZXJ2aWNlQ29udGFpbmVyKTtcbiAgICB9XG4gICAgaXNTaGVsbFN1cHBvcnRlZCh0YXJnZXRTaGVsbCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0U2hlbGwgPT09IHR5cGVzXzIuVGVybWluYWxTaGVsbFR5cGUuYmFzaCB8fFxuICAgICAgICAgICAgdGFyZ2V0U2hlbGwgPT09IHR5cGVzXzIuVGVybWluYWxTaGVsbFR5cGUuZ2l0YmFzaCB8fFxuICAgICAgICAgICAgdGFyZ2V0U2hlbGwgPT09IHR5cGVzXzIuVGVybWluYWxTaGVsbFR5cGUud3NsIHx8XG4gICAgICAgICAgICB0YXJnZXRTaGVsbCA9PT0gdHlwZXNfMi5UZXJtaW5hbFNoZWxsVHlwZS5rc2ggfHxcbiAgICAgICAgICAgIHRhcmdldFNoZWxsID09PSB0eXBlc18yLlRlcm1pbmFsU2hlbGxUeXBlLnpzaCB8fFxuICAgICAgICAgICAgdGFyZ2V0U2hlbGwgPT09IHR5cGVzXzIuVGVybWluYWxTaGVsbFR5cGUuY3NoZWxsIHx8XG4gICAgICAgICAgICB0YXJnZXRTaGVsbCA9PT0gdHlwZXNfMi5UZXJtaW5hbFNoZWxsVHlwZS50Y3NoZWxsIHx8XG4gICAgICAgICAgICB0YXJnZXRTaGVsbCA9PT0gdHlwZXNfMi5UZXJtaW5hbFNoZWxsVHlwZS5maXNoO1xuICAgIH1cbiAgICBnZXRBY3RpdmF0aW9uQ29tbWFuZHNGb3JJbnRlcnByZXRlcihweXRob25QYXRoLCB0YXJnZXRTaGVsbCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3Qgc2NyaXB0RmlsZSA9IHlpZWxkIHRoaXMuZmluZFNjcmlwdEZpbGUocHl0aG9uUGF0aCwgdGhpcy5nZXRTY3JpcHRzSW5PcmRlck9mUHJlZmVyZW5jZSh0YXJnZXRTaGVsbCkpO1xuICAgICAgICAgICAgaWYgKCFzY3JpcHRGaWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtgc291cmNlICR7c2NyaXB0RmlsZS5maWxlVG9Db21tYW5kQXJndW1lbnQoKX1gXTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldFNjcmlwdHNJbk9yZGVyT2ZQcmVmZXJlbmNlKHRhcmdldFNoZWxsKSB7XG4gICAgICAgIHN3aXRjaCAodGFyZ2V0U2hlbGwpIHtcbiAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5UZXJtaW5hbFNoZWxsVHlwZS53c2w6XG4gICAgICAgICAgICBjYXNlIHR5cGVzXzIuVGVybWluYWxTaGVsbFR5cGUua3NoOlxuICAgICAgICAgICAgY2FzZSB0eXBlc18yLlRlcm1pbmFsU2hlbGxUeXBlLnpzaDpcbiAgICAgICAgICAgIGNhc2UgdHlwZXNfMi5UZXJtaW5hbFNoZWxsVHlwZS5naXRiYXNoOlxuICAgICAgICAgICAgY2FzZSB0eXBlc18yLlRlcm1pbmFsU2hlbGxUeXBlLmJhc2g6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWydhY3RpdmF0ZS5zaCcsICdhY3RpdmF0ZSddO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSB0eXBlc18yLlRlcm1pbmFsU2hlbGxUeXBlLnRjc2hlbGw6XG4gICAgICAgICAgICBjYXNlIHR5cGVzXzIuVGVybWluYWxTaGVsbFR5cGUuY3NoZWxsOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsnYWN0aXZhdGUuY3NoJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIHR5cGVzXzIuVGVybWluYWxTaGVsbFR5cGUuZmlzaDoge1xuICAgICAgICAgICAgICAgIHJldHVybiBbJ2FjdGl2YXRlLmZpc2gnXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuQmFzaCA9IF9fZGVjb3JhdGUoW1xuICAgIGludmVyc2lmeV8xLmluamVjdGFibGUoKSxcbiAgICBfX3BhcmFtKDAsIGludmVyc2lmeV8xLmluamVjdCh0eXBlc18xLklTZXJ2aWNlQ29udGFpbmVyKSlcbl0sIEJhc2gpO1xuZXhwb3J0cy5CYXNoID0gQmFzaDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJhc2guanMubWFwIl19