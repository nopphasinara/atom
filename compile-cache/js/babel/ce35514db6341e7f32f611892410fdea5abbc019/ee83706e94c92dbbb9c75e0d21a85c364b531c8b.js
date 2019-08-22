function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Provider = require('./Provider');

var _Provider2 = _interopRequireDefault(_Provider);

var _ProviderFactory = require('./ProviderFactory');

var _ProviderFactory2 = _interopRequireDefault(_ProviderFactory);

'use babel';

module.exports = {
  provider: null,
  activate: function activate() {},
  // Required: Return a promise, an array of suggestions, or null
  getProvider: function getProvider() {
    this.provider = this.provider instanceof _Provider2['default'] ? this.provider : _ProviderFactory2['default'].create();
    return this.provider;
  },
  setProvider: function setProvider() {
    var provider = arguments.length <= 0 || arguments[0] === undefined ? _ProviderFactory2['default'].create() : arguments[0];

    this.provider = provider;
    return this;
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXNxbC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzt3QkFFcUIsWUFBWTs7OzsrQkFDTCxtQkFBbUI7Ozs7QUFIL0MsV0FBVyxDQUFBOztBQUtYLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixVQUFRLEVBQUUsSUFBSTtBQUNkLFVBQVEsRUFBQSxvQkFBRyxFQUFFOztBQUViLGFBQVcsRUFBQSx1QkFBRztBQUNaLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsaUNBQW9CLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyw2QkFBZ0IsTUFBTSxFQUFFLENBQUE7QUFDNUYsV0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0dBQ3JCO0FBQ0QsYUFBVyxFQUFBLHVCQUFzQztRQUFyQyxRQUFRLHlEQUFHLDZCQUFnQixNQUFNLEVBQUU7O0FBQzdDLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLFdBQU8sSUFBSSxDQUFBO0dBQ1o7Q0FDRixDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXNxbC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBQcm92aWRlciBmcm9tICcuL1Byb3ZpZGVyJ1xuaW1wb3J0IFByb3ZpZGVyRmFjdG9yeSBmcm9tICcuL1Byb3ZpZGVyRmFjdG9yeSdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHByb3ZpZGVyOiBudWxsLFxuICBhY3RpdmF0ZSgpIHt9LFxuICAvLyBSZXF1aXJlZDogUmV0dXJuIGEgcHJvbWlzZSwgYW4gYXJyYXkgb2Ygc3VnZ2VzdGlvbnMsIG9yIG51bGxcbiAgZ2V0UHJvdmlkZXIoKSB7XG4gICAgdGhpcy5wcm92aWRlciA9IHRoaXMucHJvdmlkZXIgaW5zdGFuY2VvZiBQcm92aWRlciA/IHRoaXMucHJvdmlkZXIgOiBQcm92aWRlckZhY3RvcnkuY3JlYXRlKClcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxuICB9LFxuICBzZXRQcm92aWRlcihwcm92aWRlciA9IFByb3ZpZGVyRmFjdG9yeS5jcmVhdGUoKSkge1xuICAgIHRoaXMucHJvdmlkZXIgPSBwcm92aWRlclxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbiJdfQ==