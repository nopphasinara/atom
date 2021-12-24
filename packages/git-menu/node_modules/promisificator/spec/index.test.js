const promisificator = require("../src");
const {promisify} = promisificator;

describe("promisificator", () => {
	let passingFunc, failingFunc;
	beforeEach(() => {
		passingFunc = (arg, cb) => {
			setTimeout(() => cb(null, arg), 1);
		};

		failingFunc = (arg, cb) => {
			setTimeout(() => cb(arg), 1);
		};
	});

	test("should resolve arg from promise", async () => {
		const {callback, promise} = promisificator();
		const arg = "arg";
		passingFunc(arg, callback);
		const value = await promise;
		expect(value).toBe(arg);
	});

	test("should reject arg from promise", async () => {
		const {callback, promise} = promisificator();
		const arg = "arg";
		failingFunc(arg, callback);
		let err;
		try {
			await promise;
		} catch (error) {
			err = error;
		}
		expect(err).toBe(arg);
	});

	test("should call callback with args after tick", (done) => {
		const cb = jest.fn(a => a);
		const {callback, promise} = promisificator(cb);
		const arg = "arg";
		callback(arg);
		expect(cb).not.toHaveBeenCalled();
		expect(promise).toBeUndefined();
		process.nextTick(() => {
			expect(cb).toHaveBeenCalledWith(arg);
			done();
		});
	});

	test("should not use nextTick to call the callback", () => {
		const cb = jest.fn(a => a);
		const {callback, promise} = promisificator(cb, {useNextTick: false});
		const arg = "arg";
		callback(arg);
		expect(cb).toHaveBeenCalled();
		expect(promise).toBeUndefined();
	});

	test("should throw if invalid type", () => {
		let err;
		try {
			promisificator(1);
		} catch (error) {
			err = error;
		}
		expect(err).toEqual(expect.any(Error));
	});

	test("should allow options as first argument", async () => {
		const {callback, promise} = promisificator({rejectOnError: false});
		const arg = "arg";
		failingFunc(arg, callback);
		const value = await promise;
		expect(value).toBe(arg);
	});

	test("should allow options as second argument with null callback", async () => {
		const {callback, promise} = promisificator(null, {rejectOnError: false});
		const arg = "arg";
		failingFunc(arg, callback);
		const value = await promise;
		expect(value).toBe(arg);
	});

	test("should resolve arg if rejectOnError is false", async () => {
		const {callback, promise} = promisificator({rejectOnError: false});
		const arg = "arg";
		failingFunc(arg, callback);
		const value = await promise;
		expect(value).toBe(arg);
	});

	test("should resolve [arg] if alwaysReturnArray is true", async () => {
		const {callback, promise} = promisificator({alwaysReturnArray: true});
		const arg = "arg";
		passingFunc(arg, callback);
		const value = await promise;
		expect(value).toEqual([arg]);
	});

	test("should resolve [arg] if alwaysReturnArray is true and rejectOnError is false", async () => {
		const {callback, promise} = promisificator({rejectOnError: false, alwaysReturnArray: true});
		const arg = "arg";
		failingFunc(arg, callback);
		const value = await promise;
		expect(value).toEqual([arg]);
	});

	describe("promisify", () => {
		test("should resolve arg from promisify", async () => {
			const arg = "arg";
			const value = await promisify(passingFunc)(arg);
			expect(value).toBe(arg);
		});

		test("should resolve arg from promisify", async () => {
			const value = await promisify(passingFunc)();
			expect(value).toBeUndefined();
		});

		test("should reject arg from promisify", async () => {
			const arg = "arg";
			let err;
			try {
				await promisify(failingFunc)(arg);
			} catch (error) {
				err = error;
			}
			expect(err).toBe(arg);
		});

		test("should be able to reuse promisified function", async () => {
			const passingAsync = promisify(passingFunc);
			const failingAsync = promisify(failingFunc);
			let err;
			let value;

			value = await passingAsync(1);
			expect(value).toBe(1);

			try {
				await failingAsync(1);
			} catch (error) {
				err = error;
			}
			expect(err).toBe(1);

			value = await passingAsync(2);
			expect(value).toBe(2);

			try {
				await failingAsync(2);
			} catch (error) {
				err = error;
			}
			expect(err).toBe(2);
		});

		test("should resolve arg if rejectOnError is false", async () => {
			const arg = "arg";
			const value = await promisify(failingFunc, {rejectOnError: false})(arg);
			expect(value).toBe(arg);
		});

		test("should resolve [arg] if alwaysReturnArray is true", async () => {
			const arg = "arg";
			const value = await promisify(passingFunc, {alwaysReturnArray: true})(arg);
			expect(value).toEqual([arg]);
		});

		test("should resolve [arg] if alwaysReturnArray is true and rejectOnError is false", async () => {
			const arg = "arg";
			const value = await promisify(failingFunc, {rejectOnError: false, alwaysReturnArray: true})(arg);
			expect(value).toEqual([arg]);
		});

		describe("callbackArg option", () => {
			let	middleCallback, agumentsCallback;
			beforeEach(() => {
				middleCallback = (arg, cb, arg1) => {
					setTimeout(() => cb(null, arg, arg1), 1);
				};
				agumentsCallback = (...args) => {
					const cb = args.pop();
					setTimeout(() => cb(null, ...args), 1);
				};
			});

			test("should set the callback arg according to callbackArg", async () => {
				const arg = "arg";
				const arg1 = "arg1";
				const value = await promisify(middleCallback, {callbackArg: 1})(arg, null, arg1);
				expect(value).toEqual([arg, arg1]);
			});

			test("should set the callback arg according to negative callbackArg", async () => {
				const arg = "arg";
				const arg1 = "arg1";
				const value = await promisify(middleCallback, {callbackArg: -2})(arg, null, arg1);
				expect(value).toEqual([arg, arg1]);
			});

			test("should set the callback arg to -1 if negative arg is greater than length", async () => {
				let err;
				try {
					const arg = "arg";
					await promisify(arg1 => arg1, {callbackArg: -2})(arg);
				} catch (error) {
					err = error;
				}
				expect(err).toEqual(expect.any(Error));
			});

			test("should set the callback arg to -1 by default", async () => {
				const arg = "arg";
				const arg1 = "arg1";
				const value = await promisify(agumentsCallback)(arg, arg1);
				expect(value).toEqual([arg, arg1]);
			});

			test("should throw if invalid", async () => {
				let err;
				try {
					await promisify(() => {}, {callbackArg: "a"})();
				} catch (error) {
					err = error;
				}
				expect(err).toEqual(expect.any(Error));
			});
		});
	});
});
