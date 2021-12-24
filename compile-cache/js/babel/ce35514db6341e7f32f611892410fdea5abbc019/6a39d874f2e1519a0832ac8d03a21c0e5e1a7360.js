Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @babel */

var StatusBarManager = (function () {
	function StatusBarManager() {
		_classCallCheck(this, StatusBarManager);

		this.busySignal = null;
		this.tile = null;
		this.onDidClick = null;
		this.element = null;
		this.progressBar = null;
		this.label = null;
	}

	_createClass(StatusBarManager, [{
		key: "addBusySignal",
		value: function addBusySignal(busySignal) {
			if (this.busySignal) {
				this.busySignal.dispose();
			}
			if (this.tile) {
				this.tile.destroy();
				this.tile = null;
				this.onDidClick = null;
				this.element = null;
				this.progressBar = null;
				this.label = null;
			}

			this.busySignal = busySignal;
		}
	}, {
		key: "addStatusBar",
		value: function addStatusBar(statusBar) {
			if (this.busySignal) {
				// prefer busy signal
				return;
			}

			if (this.tile) {
				this.tile.destroy();
			}

			this.progressBar = document.createElement("progress");

			this.label = document.createElement("span");
			this.label.innerHTML = "git-menu";

			this.element = document.createElement("div");
			this.element.classList.add("git-menu", "status", "hidden");
			this.element.appendChild(this.progressBar);
			this.element.appendChild(this.label);

			this.onDidClick = null;

			this.tile = statusBar.addRightTile({
				item: this.element,
				priority: Number.MAX_SAFE_INTEGER
			});
		}
	}, {
		key: "destroy",
		value: function destroy() {
			if (this.tile) {
				this.tile.destroy();
				this.tile = null;
				this.onDidClick = null;
				this.element = null;
				this.progressBar = null;
				this.label = null;
			}
			if (this.busySignal) {
				this.busySignal.dispose();
				this.busySignal = null;
			}
		}
	}, {
		key: "show",
		value: function show(label) {
			var opts = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

			if (opts === null || typeof opts === "number") {
				// eslint-disable-next-line no-param-reassign
				opts = {
					progress: opts
				};
			}

			if (opts instanceof Promise) {
				// eslint-disable-next-line no-param-reassign
				opts = {
					promise: opts
				};
			} else if (typeof opts === "function" || opts && opts.then) {
				// eslint-disable-next-line no-param-reassign
				opts = {
					promise: Promise.resolve(opts)
				};
			}

			if (this.tile) {
				if (this.onDidClick) {
					this.element.removeEventListener("click", this.onDidClick);
					this.onDidClick = null;
				}

				if (typeof label !== "undefined") {
					this.setLabel(label);
				}
				if ("progress" in opts) {
					this.setProgress(opts.progress);
				}
				this.element.classList.remove("hidden");
				if (opts.onDidClick) {
					this.onDidClick = opts.onDidClick;
					this.element.addEventListener("click", this.onDidClick);
				}
			}

			if (this.busySignal) {
				var busySignalOpts = {
					revealTooltip: "revealTooltip" in opts ? !!opts.revealTooltip : true
				};
				if (opts.waitingFor) {
					busySignalOpts.waitingFor = opts.waitingFor;
				}
				if (opts.onDidClick) {
					busySignalOpts.onDidClick = opts.onDidClick;
				}
				if (!opts.append && this.lastBusyMessage) {
					this.lastBusyMessage.dispose();
					this.lastBusyMessage = null;
				}
				if (opts.promise) {
					return this.busySignal.reportBusyWhile(label, function () {
						return opts.promise;
					}, busySignalOpts);
				}

				this.lastBusyMessage = this.busySignal.reportBusy(label, busySignalOpts);
				return this.lastBusyMessage;
			}
		}
	}, {
		key: "hide",
		value: function hide(busyMessage) {
			if (this.tile) {
				this.element.classList.add("hidden");

				if (this.onDidClick) {
					this.element.removeEventListener("click", this.onDidClick);
					this.onDidClick = null;
				}
			}

			if (this.busySignal) {
				if (busyMessage) {
					busyMessage.dispose();
					if (this.lastBusyMessage === busyMessage) {
						this.lastBusyMessage = null;
					}
				} else if (this.lastBusyMessage) {
					this.lastBusyMessage.dispose();
					this.lastBusyMessage = null;
				}
			}
		}
	}, {
		key: "setLabel",
		value: function setLabel(label, busyMessage) {
			if (this.tile) {
				this.label.innerHTML = label;
			}

			if (this.busySignal) {
				if (busyMessage) {
					busyMessage.setTitle(label);
				} else if (this.lastBusyMessage) {
					this.lastBusyMessage.setTitle(label);
				} else {
					return this.show(label);
				}
			}
		}
	}, {
		key: "setProgress",
		value: function setProgress(progress) {
			if (this.tile) {
				var prog = parseInt(progress, 10);
				// check if progress is a number
				if (isNaN(prog)) {
					// set progress to indeterminate
					this.progressBar.removeAttribute("value");
				} else {
					this.progressBar.value = prog;
				}
			}
		}
	}, {
		key: "setProgressMax",
		value: function setProgressMax(max) {
			if (this.tile) {
				this.progressBar.max = max;
			}
		}
	}]);

	return StatusBarManager;
})();

exports["default"] = StatusBarManager;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvd2lkZ2V0cy9TdGF0dXNCYXJNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFFcUIsZ0JBQWdCO0FBRXpCLFVBRlMsZ0JBQWdCLEdBRXRCO3dCQUZNLGdCQUFnQjs7QUFHbkMsTUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdkIsTUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsTUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdkIsTUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsTUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDeEIsTUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7RUFDbEI7O2NBVG1CLGdCQUFnQjs7U0FXdkIsdUJBQUMsVUFBVSxFQUFFO0FBQ3pCLE9BQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNwQixRQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzFCO0FBQ0QsT0FBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2QsUUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUN4QixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNsQjs7QUFFRCxPQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztHQUM3Qjs7O1NBRVcsc0JBQUMsU0FBUyxFQUFFO0FBQ3ZCLE9BQUksSUFBSSxDQUFDLFVBQVUsRUFBRTs7QUFFcEIsV0FBTztJQUNQOztBQUVELE9BQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNkLFFBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDcEI7O0FBR0QsT0FBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUV0RCxPQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUMsT0FBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDOztBQUVsQyxPQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsT0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDM0QsT0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzNDLE9BQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFckMsT0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7O0FBRXZCLE9BQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQztBQUNsQyxRQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87QUFDbEIsWUFBUSxFQUFFLE1BQU0sQ0FBQyxnQkFBZ0I7SUFDakMsQ0FBQyxDQUFDO0dBQ0g7OztTQUVNLG1CQUFHO0FBQ1QsT0FBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2QsUUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUN4QixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNsQjtBQUNELE9BQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNwQixRQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCO0dBQ0Q7OztTQUVHLGNBQUMsS0FBSyxFQUFlO09BQWIsSUFBSSx5REFBRyxJQUFJOztBQUN0QixPQUFJLElBQUksS0FBSyxJQUFJLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFOztBQUU5QyxRQUFJLEdBQUc7QUFDTixhQUFRLEVBQUUsSUFBSTtLQUNkLENBQUM7SUFDRjs7QUFFRCxPQUFJLElBQUksWUFBWSxPQUFPLEVBQUU7O0FBRTVCLFFBQUksR0FBRztBQUNOLFlBQU8sRUFBRSxJQUFJO0tBQ2IsQ0FBQztJQUNGLE1BQU0sSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVLElBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEFBQUMsRUFBRTs7QUFFN0QsUUFBSSxHQUFHO0FBQ04sWUFBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0tBQzlCLENBQUM7SUFDRjs7QUFFRCxPQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDZCxRQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDcEIsU0FBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNELFNBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0tBQ3ZCOztBQUVELFFBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxFQUFFO0FBQ2pDLFNBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckI7QUFDRCxRQUFJLFVBQVUsSUFBSSxJQUFJLEVBQUU7QUFDdkIsU0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDaEM7QUFDRCxRQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEMsUUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3BCLFNBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUNsQyxTQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDeEQ7SUFDRDs7QUFFRCxPQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDcEIsUUFBTSxjQUFjLEdBQUc7QUFDdEIsa0JBQWEsRUFBRSxBQUFDLGVBQWUsSUFBSSxJQUFJLEdBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSTtLQUN0RSxDQUFDO0FBQ0YsUUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3BCLG1CQUFjLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7S0FDNUM7QUFDRCxRQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDcEIsbUJBQWMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztLQUM1QztBQUNELFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDekMsU0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMvQixTQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztLQUM1QjtBQUNELFFBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNqQixZQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRTthQUFNLElBQUksQ0FBQyxPQUFPO01BQUEsRUFBRSxjQUFjLENBQUMsQ0FBQztLQUNsRjs7QUFFRCxRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQztBQUN6RSxXQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDNUI7R0FDRDs7O1NBRUcsY0FBQyxXQUFXLEVBQUU7QUFDakIsT0FBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2QsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVyQyxRQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDcEIsU0FBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNELFNBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0tBQ3ZCO0lBQ0Q7O0FBRUQsT0FBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3BCLFFBQUksV0FBVyxFQUFFO0FBQ2hCLGdCQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdEIsU0FBSSxJQUFJLENBQUMsZUFBZSxLQUFLLFdBQVcsRUFBRTtBQUN6QyxVQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztNQUM1QjtLQUNELE1BQU0sSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ2hDLFNBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDL0IsU0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7S0FDNUI7SUFDRDtHQUNEOzs7U0FFTyxrQkFBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO0FBQzVCLE9BQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNkLFFBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUM3Qjs7QUFFRCxPQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDcEIsUUFBSSxXQUFXLEVBQUU7QUFDaEIsZ0JBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDNUIsTUFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDaEMsU0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckMsTUFBTTtBQUNOLFlBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4QjtJQUNEO0dBQ0Q7OztTQUVVLHFCQUFDLFFBQVEsRUFBRTtBQUNyQixPQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDZCxRQUFNLElBQUksR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUVwQyxRQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTs7QUFFaEIsU0FBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDMUMsTUFBTTtBQUNOLFNBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztLQUM5QjtJQUNEO0dBQ0Q7OztTQUVhLHdCQUFDLEdBQUcsRUFBRTtBQUNuQixPQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDZCxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDM0I7R0FDRDs7O1FBN0xtQixnQkFBZ0I7OztxQkFBaEIsZ0JBQWdCIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvd2lkZ2V0cy9TdGF0dXNCYXJNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0dXNCYXJNYW5hZ2VyIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmJ1c3lTaWduYWwgPSBudWxsO1xuXHRcdHRoaXMudGlsZSA9IG51bGw7XG5cdFx0dGhpcy5vbkRpZENsaWNrID0gbnVsbDtcblx0XHR0aGlzLmVsZW1lbnQgPSBudWxsO1xuXHRcdHRoaXMucHJvZ3Jlc3NCYXIgPSBudWxsO1xuXHRcdHRoaXMubGFiZWwgPSBudWxsO1xuXHR9XG5cblx0YWRkQnVzeVNpZ25hbChidXN5U2lnbmFsKSB7XG5cdFx0aWYgKHRoaXMuYnVzeVNpZ25hbCkge1xuXHRcdFx0dGhpcy5idXN5U2lnbmFsLmRpc3Bvc2UoKTtcblx0XHR9XG5cdFx0aWYgKHRoaXMudGlsZSkge1xuXHRcdFx0dGhpcy50aWxlLmRlc3Ryb3koKTtcblx0XHRcdHRoaXMudGlsZSA9IG51bGw7XG5cdFx0XHR0aGlzLm9uRGlkQ2xpY2sgPSBudWxsO1xuXHRcdFx0dGhpcy5lbGVtZW50ID0gbnVsbDtcblx0XHRcdHRoaXMucHJvZ3Jlc3NCYXIgPSBudWxsO1xuXHRcdFx0dGhpcy5sYWJlbCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0dGhpcy5idXN5U2lnbmFsID0gYnVzeVNpZ25hbDtcblx0fVxuXG5cdGFkZFN0YXR1c0JhcihzdGF0dXNCYXIpIHtcblx0XHRpZiAodGhpcy5idXN5U2lnbmFsKSB7XG5cdFx0XHQvLyBwcmVmZXIgYnVzeSBzaWduYWxcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodGhpcy50aWxlKSB7XG5cdFx0XHR0aGlzLnRpbGUuZGVzdHJveSgpO1xuXHRcdH1cblxuXG5cdFx0dGhpcy5wcm9ncmVzc0JhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcm9ncmVzc1wiKTtcblxuXHRcdHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblx0XHR0aGlzLmxhYmVsLmlubmVySFRNTCA9IFwiZ2l0LW1lbnVcIjtcblxuXHRcdHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJnaXQtbWVudVwiLCBcInN0YXR1c1wiLCBcImhpZGRlblwiKTtcblx0XHR0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5wcm9ncmVzc0Jhcik7XG5cdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xuXG5cdFx0dGhpcy5vbkRpZENsaWNrID0gbnVsbDtcblxuXHRcdHRoaXMudGlsZSA9IHN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuXHRcdFx0aXRlbTogdGhpcy5lbGVtZW50LFxuXHRcdFx0cHJpb3JpdHk6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuXHRcdH0pO1xuXHR9XG5cblx0ZGVzdHJveSgpIHtcblx0XHRpZiAodGhpcy50aWxlKSB7XG5cdFx0XHR0aGlzLnRpbGUuZGVzdHJveSgpO1xuXHRcdFx0dGhpcy50aWxlID0gbnVsbDtcblx0XHRcdHRoaXMub25EaWRDbGljayA9IG51bGw7XG5cdFx0XHR0aGlzLmVsZW1lbnQgPSBudWxsO1xuXHRcdFx0dGhpcy5wcm9ncmVzc0JhciA9IG51bGw7XG5cdFx0XHR0aGlzLmxhYmVsID0gbnVsbDtcblx0XHR9XG5cdFx0aWYgKHRoaXMuYnVzeVNpZ25hbCkge1xuXHRcdFx0dGhpcy5idXN5U2lnbmFsLmRpc3Bvc2UoKTtcblx0XHRcdHRoaXMuYnVzeVNpZ25hbCA9IG51bGw7XG5cdFx0fVxuXHR9XG5cblx0c2hvdyhsYWJlbCwgb3B0cyA9IG51bGwpIHtcblx0XHRpZiAob3B0cyA9PT0gbnVsbCB8fCB0eXBlb2Ygb3B0cyA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG5cdFx0XHRvcHRzID0ge1xuXHRcdFx0XHRwcm9ncmVzczogb3B0cyxcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKG9wdHMgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cblx0XHRcdG9wdHMgPSB7XG5cdFx0XHRcdHByb21pc2U6IG9wdHMsXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIG9wdHMgPT09IFwiZnVuY3Rpb25cIiB8fCAob3B0cyAmJiBvcHRzLnRoZW4pKSB7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cblx0XHRcdG9wdHMgPSB7XG5cdFx0XHRcdHByb21pc2U6IFByb21pc2UucmVzb2x2ZShvcHRzKSxcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMudGlsZSkge1xuXHRcdFx0aWYgKHRoaXMub25EaWRDbGljaykge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25EaWRDbGljayk7XG5cdFx0XHRcdHRoaXMub25EaWRDbGljayA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0eXBlb2YgbGFiZWwgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0dGhpcy5zZXRMYWJlbChsYWJlbCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoXCJwcm9ncmVzc1wiIGluIG9wdHMpIHtcblx0XHRcdFx0dGhpcy5zZXRQcm9ncmVzcyhvcHRzLnByb2dyZXNzKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuXHRcdFx0aWYgKG9wdHMub25EaWRDbGljaykge1xuXHRcdFx0XHR0aGlzLm9uRGlkQ2xpY2sgPSBvcHRzLm9uRGlkQ2xpY2s7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkRpZENsaWNrKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5idXN5U2lnbmFsKSB7XG5cdFx0XHRjb25zdCBidXN5U2lnbmFsT3B0cyA9IHtcblx0XHRcdFx0cmV2ZWFsVG9vbHRpcDogKFwicmV2ZWFsVG9vbHRpcFwiIGluIG9wdHMpID8gISFvcHRzLnJldmVhbFRvb2x0aXAgOiB0cnVlLFxuXHRcdFx0fTtcblx0XHRcdGlmIChvcHRzLndhaXRpbmdGb3IpIHtcblx0XHRcdFx0YnVzeVNpZ25hbE9wdHMud2FpdGluZ0ZvciA9IG9wdHMud2FpdGluZ0Zvcjtcblx0XHRcdH1cblx0XHRcdGlmIChvcHRzLm9uRGlkQ2xpY2spIHtcblx0XHRcdFx0YnVzeVNpZ25hbE9wdHMub25EaWRDbGljayA9IG9wdHMub25EaWRDbGljaztcblx0XHRcdH1cblx0XHRcdGlmICghb3B0cy5hcHBlbmQgJiYgdGhpcy5sYXN0QnVzeU1lc3NhZ2UpIHtcblx0XHRcdFx0dGhpcy5sYXN0QnVzeU1lc3NhZ2UuZGlzcG9zZSgpO1xuXHRcdFx0XHR0aGlzLmxhc3RCdXN5TWVzc2FnZSA9IG51bGw7XG5cdFx0XHR9XG5cdFx0XHRpZiAob3B0cy5wcm9taXNlKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmJ1c3lTaWduYWwucmVwb3J0QnVzeVdoaWxlKGxhYmVsLCAoKSA9PiBvcHRzLnByb21pc2UsIGJ1c3lTaWduYWxPcHRzKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5sYXN0QnVzeU1lc3NhZ2UgPSB0aGlzLmJ1c3lTaWduYWwucmVwb3J0QnVzeShsYWJlbCwgYnVzeVNpZ25hbE9wdHMpO1xuXHRcdFx0cmV0dXJuIHRoaXMubGFzdEJ1c3lNZXNzYWdlO1xuXHRcdH1cblx0fVxuXG5cdGhpZGUoYnVzeU1lc3NhZ2UpIHtcblx0XHRpZiAodGhpcy50aWxlKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcblxuXHRcdFx0aWYgKHRoaXMub25EaWRDbGljaykge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25EaWRDbGljayk7XG5cdFx0XHRcdHRoaXMub25EaWRDbGljayA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuYnVzeVNpZ25hbCkge1xuXHRcdFx0aWYgKGJ1c3lNZXNzYWdlKSB7XG5cdFx0XHRcdGJ1c3lNZXNzYWdlLmRpc3Bvc2UoKTtcblx0XHRcdFx0aWYgKHRoaXMubGFzdEJ1c3lNZXNzYWdlID09PSBidXN5TWVzc2FnZSkge1xuXHRcdFx0XHRcdHRoaXMubGFzdEJ1c3lNZXNzYWdlID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICh0aGlzLmxhc3RCdXN5TWVzc2FnZSkge1xuXHRcdFx0XHR0aGlzLmxhc3RCdXN5TWVzc2FnZS5kaXNwb3NlKCk7XG5cdFx0XHRcdHRoaXMubGFzdEJ1c3lNZXNzYWdlID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRzZXRMYWJlbChsYWJlbCwgYnVzeU1lc3NhZ2UpIHtcblx0XHRpZiAodGhpcy50aWxlKSB7XG5cdFx0XHR0aGlzLmxhYmVsLmlubmVySFRNTCA9IGxhYmVsO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmJ1c3lTaWduYWwpIHtcblx0XHRcdGlmIChidXN5TWVzc2FnZSkge1xuXHRcdFx0XHRidXN5TWVzc2FnZS5zZXRUaXRsZShsYWJlbCk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMubGFzdEJ1c3lNZXNzYWdlKSB7XG5cdFx0XHRcdHRoaXMubGFzdEJ1c3lNZXNzYWdlLnNldFRpdGxlKGxhYmVsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnNob3cobGFiZWwpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHNldFByb2dyZXNzKHByb2dyZXNzKSB7XG5cdFx0aWYgKHRoaXMudGlsZSkge1xuXHRcdFx0Y29uc3QgcHJvZyA9IHBhcnNlSW50KHByb2dyZXNzLCAxMCk7XG5cdFx0XHQvLyBjaGVjayBpZiBwcm9ncmVzcyBpcyBhIG51bWJlclxuXHRcdFx0aWYgKGlzTmFOKHByb2cpKSB7XG5cdFx0XHRcdC8vIHNldCBwcm9ncmVzcyB0byBpbmRldGVybWluYXRlXG5cdFx0XHRcdHRoaXMucHJvZ3Jlc3NCYXIucmVtb3ZlQXR0cmlidXRlKFwidmFsdWVcIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnByb2dyZXNzQmFyLnZhbHVlID0gcHJvZztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRzZXRQcm9ncmVzc01heChtYXgpIHtcblx0XHRpZiAodGhpcy50aWxlKSB7XG5cdFx0XHR0aGlzLnByb2dyZXNzQmFyLm1heCA9IG1heDtcblx0XHR9XG5cdH1cbn1cbiJdfQ==