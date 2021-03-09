const defaultOptions = {
	rejectOnError: true,
	alwaysReturnArray: false,
	callbackArg: -1,
	useNextTick: true,
};

const promisificator = (cb, options) => {
	let promise, callback;
	if (typeof cb === "object" && cb !== null) {
		options = cb; // eslint-disable-line no-param-reassign
		cb = null; // eslint-disable-line no-param-reassign
	}

	const opts = Object.assign({}, defaultOptions, options);
	if (typeof cb === "function") {
		callback = function (...args) {
			if (opts.useNextTick) {
				process.nextTick(cb, ...args);
			} else {
				cb(...args);
			}
		};
	} else if (typeof cb === "undefined" || cb === null) {
		promise = new Promise((resolve, reject) => {
			callback = function (...args) {
				if (opts.rejectOnError) {
					if (args[0]) {
						reject(args[0]);
					} else if (args.length <= 2 && !opts.alwaysReturnArray) {
						resolve(args[1]);
					} else {
						resolve(args.slice(1));
					}
				} else {
					if (args.length <= 1 && !opts.alwaysReturnArray) {
						resolve(args[0]);
					} else {
						resolve(args);
					}
				}
			};
		});
	} else {
		throw new Error("Invalid argument for callback");
	}

	return {
		promise,
		callback,
	};
};

promisificator.promisify = function (func, options) {
	const opts = Object.assign({}, defaultOptions, options);
	let cbArg = parseInt(opts.callbackArg, 10);
	if (isNaN(cbArg)) {
		throw new Error("Invalid value for callbackArg");
	} else if (func.length > 0 && cbArg < 0) {
		if (-cbArg <= func.length) {
			cbArg = func.length + cbArg;
		} else {
			throw new Error("Invalid value for callbackArg");
		}
	}
	return function (...args) {
		const {promise, callback} = promisificator(options);
		if (cbArg >= 0) {
			let undef;
			while (args.length < cbArg) {
				args.push(undef);
			}
			args[cbArg] = callback;
		} else {
			// func.length is most likely not correct
			// so we push callback on array at location -cbArg from end
			args[args.length + 1 + cbArg] = callback;
		}
		func(...args);
		return promise;
	};
};

module.exports = promisificator;
