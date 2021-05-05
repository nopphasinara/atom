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

const inversify_1 = require("inversify");

const vscode_1 = require("vscode");

const constants_1 = require("../../common/constants");

const types_1 = require("../../common/types");

const types_2 = require("../../ioc/types");

const types_3 = require("./types");

let ApplicationDiagnostics = class ApplicationDiagnostics {
  constructor(serviceContainer) {
    this.serviceContainer = serviceContainer;
  }

  performPreStartupHealthCheck() {
    return __awaiter(this, void 0, void 0, function* () {
      const diagnosticsServices = this.serviceContainer.getAll(types_3.IDiagnosticsService);
      yield Promise.all(diagnosticsServices.map(diagnosticsService => __awaiter(this, void 0, void 0, function* () {
        const diagnostics = yield diagnosticsService.diagnose();
        this.log(diagnostics);

        if (diagnostics.length > 0) {
          yield diagnosticsService.handle(diagnostics);
        }
      })));
    });
  }

  log(diagnostics) {
    const logger = this.serviceContainer.get(types_1.ILogger);
    const outputChannel = this.serviceContainer.get(types_1.IOutputChannel, constants_1.STANDARD_OUTPUT_CHANNEL);
    diagnostics.forEach(item => {
      const message = `Diagnostic Code: ${item.code}, Message: ${item.message}`;

      switch (item.severity) {
        case vscode_1.DiagnosticSeverity.Error:
          {
            logger.logError(message);
            outputChannel.appendLine(message);
            break;
          }

        case vscode_1.DiagnosticSeverity.Warning:
          {
            logger.logWarning(message);
            outputChannel.appendLine(message);
            break;
          }

        default:
          {
            logger.logInformation(message);
          }
      }
    });
  }

};
ApplicationDiagnostics = __decorate([inversify_1.injectable(), __param(0, inversify_1.inject(types_2.IServiceContainer))], ApplicationDiagnostics);
exports.ApplicationDiagnostics = ApplicationDiagnostics;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGxpY2F0aW9uRGlhZ25vc3RpY3MuanMiXSwibmFtZXMiOlsiX19kZWNvcmF0ZSIsImRlY29yYXRvcnMiLCJ0YXJnZXQiLCJrZXkiLCJkZXNjIiwiYyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInIiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkIiwiUmVmbGVjdCIsImRlY29yYXRlIiwiaSIsImRlZmluZVByb3BlcnR5IiwiX19wYXJhbSIsInBhcmFtSW5kZXgiLCJkZWNvcmF0b3IiLCJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiZXhwb3J0cyIsImludmVyc2lmeV8xIiwicmVxdWlyZSIsInZzY29kZV8xIiwiY29uc3RhbnRzXzEiLCJ0eXBlc18xIiwidHlwZXNfMiIsInR5cGVzXzMiLCJBcHBsaWNhdGlvbkRpYWdub3N0aWNzIiwiY29uc3RydWN0b3IiLCJzZXJ2aWNlQ29udGFpbmVyIiwicGVyZm9ybVByZVN0YXJ0dXBIZWFsdGhDaGVjayIsImRpYWdub3N0aWNzU2VydmljZXMiLCJnZXRBbGwiLCJJRGlhZ25vc3RpY3NTZXJ2aWNlIiwiYWxsIiwibWFwIiwiZGlhZ25vc3RpY3NTZXJ2aWNlIiwiZGlhZ25vc3RpY3MiLCJkaWFnbm9zZSIsImxvZyIsImhhbmRsZSIsImxvZ2dlciIsImdldCIsIklMb2dnZXIiLCJvdXRwdXRDaGFubmVsIiwiSU91dHB1dENoYW5uZWwiLCJTVEFOREFSRF9PVVRQVVRfQ0hBTk5FTCIsImZvckVhY2giLCJpdGVtIiwibWVzc2FnZSIsImNvZGUiLCJzZXZlcml0eSIsIkRpYWdub3N0aWNTZXZlcml0eSIsIkVycm9yIiwibG9nRXJyb3IiLCJhcHBlbmRMaW5lIiwiV2FybmluZyIsImxvZ1dhcm5pbmciLCJsb2dJbmZvcm1hdGlvbiIsImluamVjdGFibGUiLCJpbmplY3QiLCJJU2VydmljZUNvbnRhaW5lciJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUNBLElBQUlBLFVBQVUsR0FBSSxVQUFRLFNBQUtBLFVBQWQsSUFBNkIsVUFBVUMsVUFBVixFQUFzQkMsTUFBdEIsRUFBOEJDLEdBQTlCLEVBQW1DQyxJQUFuQyxFQUF5QztBQUNuRixNQUFJQyxDQUFDLEdBQUdDLFNBQVMsQ0FBQ0MsTUFBbEI7QUFBQSxNQUEwQkMsQ0FBQyxHQUFHSCxDQUFDLEdBQUcsQ0FBSixHQUFRSCxNQUFSLEdBQWlCRSxJQUFJLEtBQUssSUFBVCxHQUFnQkEsSUFBSSxHQUFHSyxNQUFNLENBQUNDLHdCQUFQLENBQWdDUixNQUFoQyxFQUF3Q0MsR0FBeEMsQ0FBdkIsR0FBc0VDLElBQXJIO0FBQUEsTUFBMkhPLENBQTNIO0FBQ0EsTUFBSSxPQUFPQyxPQUFQLEtBQW1CLFFBQW5CLElBQStCLE9BQU9BLE9BQU8sQ0FBQ0MsUUFBZixLQUE0QixVQUEvRCxFQUEyRUwsQ0FBQyxHQUFHSSxPQUFPLENBQUNDLFFBQVIsQ0FBaUJaLFVBQWpCLEVBQTZCQyxNQUE3QixFQUFxQ0MsR0FBckMsRUFBMENDLElBQTFDLENBQUosQ0FBM0UsS0FDSyxLQUFLLElBQUlVLENBQUMsR0FBR2IsVUFBVSxDQUFDTSxNQUFYLEdBQW9CLENBQWpDLEVBQW9DTyxDQUFDLElBQUksQ0FBekMsRUFBNENBLENBQUMsRUFBN0MsRUFBaUQsSUFBSUgsQ0FBQyxHQUFHVixVQUFVLENBQUNhLENBQUQsQ0FBbEIsRUFBdUJOLENBQUMsR0FBRyxDQUFDSCxDQUFDLEdBQUcsQ0FBSixHQUFRTSxDQUFDLENBQUNILENBQUQsQ0FBVCxHQUFlSCxDQUFDLEdBQUcsQ0FBSixHQUFRTSxDQUFDLENBQUNULE1BQUQsRUFBU0MsR0FBVCxFQUFjSyxDQUFkLENBQVQsR0FBNEJHLENBQUMsQ0FBQ1QsTUFBRCxFQUFTQyxHQUFU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QTRCQyxLQUFqQztBQUF3QztBQUNwQ1osWUFBQUEsTUFBTSxDQUFDYSxRQUFQLENBQWdCTCxPQUFoQjtBQUNBTCxZQUFBQSxhQUFhLENBQUNXLFVBQWQsQ0FBeUJOLE9BQXpCO0FBQ0E7QUFDSDs7QUFDRCxhQUFLM0IsUUFBUSxDQUFDOEIsa0JBQVQsQ0FBNEJJLE9BQWpDO0FBQTBDO0FBQ3RDZixZQUFBQSxNQUFNLENBQUNnQixVQUFQLENBQWtCUixPQUFsQjtBQUNBTCxZQUFBQSxhQUFhLENBQUNXLFVBQWQsQ0FBeUJOLE9BQXpCO0FBQ0E7QUFDSDs7QUFDRDtBQUFTO0FBQ0xSLFlBQUFBLE1BQU0sQ0FBQ2lCLGNBQVAsQ0FBc0JULE9BQXRCO0FBQ0g7QUFiTDtBQWVILEtBakJEO0FBa0JIOztBQXJDcUQsQ0FBMUQ7QUF1Q0F0QixzQkFBc0IsR0FBRzdDLFVBQVUsQ0FBQyxDQUNoQ3NDLFdBQVcsQ0FBQ3VDLFVBQVosRUFEZ0MsRUFFaEM3RCxPQUFPLENBQUMsQ0FBRCxFQUFJc0IsV0FBVyxDQUFDd0MsTUFBWixDQUFtQm5DLE9BQU8sQ0FBQ29DLGlCQUEzQixDQUFKLENBRnlCLENBQUQsRUFHaENsQyxzQkFIZ0MsQ0FBbkM7QUFJQVIsT0FBTyxDQUFDUSxzQkFBUixHQUFpQ0Esc0JBQWpDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4ndXNlIHN0cmljdCc7XG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG52YXIgX19wYXJhbSA9ICh0aGlzICYmIHRoaXMuX19wYXJhbSkgfHwgZnVuY3Rpb24gKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaW52ZXJzaWZ5XzEgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpO1xuY29uc3QgdnNjb2RlXzEgPSByZXF1aXJlKFwidnNjb2RlXCIpO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vLi4vY29tbW9uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vLi4vY29tbW9uL3R5cGVzXCIpO1xuY29uc3QgdHlwZXNfMiA9IHJlcXVpcmUoXCIuLi8uLi9pb2MvdHlwZXNcIik7XG5jb25zdCB0eXBlc18zID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG5sZXQgQXBwbGljYXRpb25EaWFnbm9zdGljcyA9IGNsYXNzIEFwcGxpY2F0aW9uRGlhZ25vc3RpY3Mge1xuICAgIGNvbnN0cnVjdG9yKHNlcnZpY2VDb250YWluZXIpIHtcbiAgICAgICAgdGhpcy5zZXJ2aWNlQ29udGFpbmVyID0gc2VydmljZUNvbnRhaW5lcjtcbiAgICB9XG4gICAgcGVyZm9ybVByZVN0YXJ0dXBIZWFsdGhDaGVjaygpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpYWdub3N0aWNzU2VydmljZXMgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0QWxsKHR5cGVzXzMuSURpYWdub3N0aWNzU2VydmljZSk7XG4gICAgICAgICAgICB5aWVsZCBQcm9taXNlLmFsbChkaWFnbm9zdGljc1NlcnZpY2VzLm1hcCgoZGlhZ25vc3RpY3NTZXJ2aWNlKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlhZ25vc3RpY3MgPSB5aWVsZCBkaWFnbm9zdGljc1NlcnZpY2UuZGlhZ25vc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhkaWFnbm9zdGljcyk7XG4gICAgICAgICAgICAgICAgaWYgKGRpYWdub3N0aWNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgZGlhZ25vc3RpY3NTZXJ2aWNlLmhhbmRsZShkaWFnbm9zdGljcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxvZyhkaWFnbm9zdGljcykge1xuICAgICAgICBjb25zdCBsb2dnZXIgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzEuSUxvZ2dlcik7XG4gICAgICAgIGNvbnN0IG91dHB1dENoYW5uZWwgPSB0aGlzLnNlcnZpY2VDb250YWluZXIuZ2V0KHR5cGVzXzEuSU91dHB1dENoYW5uZWwsIGNvbnN0YW50c18xLlNUQU5EQVJEX09VVFBVVF9DSEFOTkVMKTtcbiAgICAgICAgZGlhZ25vc3RpY3MuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgRGlhZ25vc3RpYyBDb2RlOiAke2l0ZW0uY29kZX0sIE1lc3NhZ2U6ICR7aXRlbS5tZXNzYWdlfWA7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uc2V2ZXJpdHkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIHZzY29kZV8xLkRpYWdub3N0aWNTZXZlcml0eS5FcnJvcjoge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIubG9nRXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dENoYW5uZWwuYXBwZW5kTGluZShtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgdnNjb2RlXzEuRGlhZ25vc3RpY1NldmVyaXR5Lldhcm5pbmc6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmxvZ1dhcm5pbmcobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dENoYW5uZWwuYXBwZW5kTGluZShtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmxvZ0luZm9ybWF0aW9uKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbkFwcGxpY2F0aW9uRGlhZ25vc3RpY3MgPSBfX2RlY29yYXRlKFtcbiAgICBpbnZlcnNpZnlfMS5pbmplY3RhYmxlKCksXG4gICAgX19wYXJhbSgwLCBpbnZlcnNpZnlfMS5pbmplY3QodHlwZXNfMi5JU2VydmljZUNvbnRhaW5lcikpXG5dLCBBcHBsaWNhdGlvbkRpYWdub3N0aWNzKTtcbmV4cG9ydHMuQXBwbGljYXRpb25EaWFnbm9zdGljcyA9IEFwcGxpY2F0aW9uRGlhZ25vc3RpY3M7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHBsaWNhdGlvbkRpYWdub3N0aWNzLmpzLm1hcCJdfQ==