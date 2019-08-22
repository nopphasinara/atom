
/*
  lib/sub-atom.coffee
 */

(function() {
  var $, CompositeDisposable, Disposable, SubAtom, ref,
    slice = [].slice;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  $ = require('jquery');

  module.exports = SubAtom = (function() {
    function SubAtom() {
      this.disposables = new CompositeDisposable;
    }

    SubAtom.prototype.addDisposable = function(disposable, disposeEventObj, disposeEventType) {
      var autoDisposables, e;
      if (disposeEventObj) {
        try {
          autoDisposables = new CompositeDisposable;
          autoDisposables.add(disposable);
          autoDisposables.add(disposeEventObj[disposeEventType]((function(_this) {
            return function() {
              autoDisposables.dispose();
              return _this.disposables.remove(autoDisposables);
            };
          })(this)));
          return this.disposables.add(autoDisposables);
        } catch (error) {
          e = error;
          return console.log('SubAtom::add, invalid dispose event', disposeEventObj, disposeEventType, e);
        }
      } else {
        return this.disposables.add(disposable);
      }
    };

    SubAtom.prototype.addElementListener = function(ele, events, selector, disposeEventObj, disposeEventType, handler) {
      var disposable, subscription;
      if (selector) {
        subscription = $(ele).on(events, selector, handler);
      } else {
        subscription = $(ele).on(events, handler);
      }
      disposable = new Disposable(function() {
        return subscription.off(events, handler);
      });
      return this.addDisposable(disposable, disposeEventObj, disposeEventType);
    };

    SubAtom.prototype.add = function() {
      var arg, args, disposeEventObj, disposeEventType, ele, events, handler, i, len, selector, signature;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      signature = '';
      for (i = 0, len = args.length; i < len; i++) {
        arg = args[i];
        switch (typeof arg) {
          case 'string':
            signature += 's';
            break;
          case 'object':
            signature += 'o';
            break;
          case 'function':
            signature += 'f';
        }
      }
      switch (signature) {
        case 'o':
        case 'oos':
          return this.addDisposable.apply(this, args);
        case 'ssf':
        case 'osf':
          ele = args[0], events = args[1], handler = args[2];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ossf':
        case 'sssf':
          ele = args[0], events = args[1], selector = args[2], handler = args[3];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ososf':
        case 'ssosf':
          ele = args[0], events = args[1], disposeEventObj = args[2], disposeEventType = args[3], handler = args[4];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ossosf':
        case 'sssosf':
          ele = args[0], events = args[1], selector = args[2], disposeEventObj = args[3], disposeEventType = args[4], handler = args[5];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        default:
          console.log('SubAtom::add, invalid call signature', args);
      }
    };

    SubAtom.prototype.remove = function() {
      var args, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref1 = this.disposables).remove.apply(ref1, args);
    };

    SubAtom.prototype.clear = function() {
      return this.disposables.clear();
    };

    SubAtom.prototype.dispose = function() {
      return this.disposables.dispose();
    };

    return SubAtom;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbm9kZV9tb2R1bGVzL3N1Yi1hdG9tL2xpYi9zdWItYXRvbS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7QUFBQSxNQUFBLGdEQUFBO0lBQUE7O0VBSUEsTUFBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFDdEIsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFFUyxpQkFBQTtNQUNYLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSTtJQURSOztzQkFHYixhQUFBLEdBQWUsU0FBQyxVQUFELEVBQWEsZUFBYixFQUE4QixnQkFBOUI7QUFDYixVQUFBO01BQUEsSUFBRyxlQUFIO0FBQ0U7VUFDRSxlQUFBLEdBQWtCLElBQUk7VUFDdEIsZUFBZSxDQUFDLEdBQWhCLENBQW9CLFVBQXBCO1VBQ0EsZUFBZSxDQUFDLEdBQWhCLENBQW9CLGVBQWdCLENBQUEsZ0JBQUEsQ0FBaEIsQ0FBa0MsQ0FBQSxTQUFBLEtBQUE7bUJBQUEsU0FBQTtjQUNwRCxlQUFlLENBQUMsT0FBaEIsQ0FBQTtxQkFDQSxLQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsQ0FBb0IsZUFBcEI7WUFGb0Q7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQXBCO2lCQUdBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixlQUFqQixFQU5GO1NBQUEsYUFBQTtVQU9NO2lCQUNKLE9BQU8sQ0FBQyxHQUFSLENBQVkscUNBQVosRUFBbUQsZUFBbkQsRUFBb0UsZ0JBQXBFLEVBQXNGLENBQXRGLEVBUkY7U0FERjtPQUFBLE1BQUE7ZUFXRSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsVUFBakIsRUFYRjs7SUFEYTs7c0JBY2Ysa0JBQUEsR0FBb0IsU0FBQyxHQUFELEVBQU0sTUFBTixFQUFjLFFBQWQsRUFBd0IsZUFBeEIsRUFBeUMsZ0JBQXpDLEVBQTJELE9BQTNEO0FBQ2xCLFVBQUE7TUFBQSxJQUFHLFFBQUg7UUFDRSxZQUFBLEdBQWUsQ0FBQSxDQUFFLEdBQUYsQ0FBTSxDQUFDLEVBQVAsQ0FBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLE9BQTVCLEVBRGpCO09BQUEsTUFBQTtRQUdFLFlBQUEsR0FBZSxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsRUFBUCxDQUFVLE1BQVYsRUFBa0IsT0FBbEIsRUFIakI7O01BSUEsVUFBQSxHQUFhLElBQUksVUFBSixDQUFlLFNBQUE7ZUFBRyxZQUFZLENBQUMsR0FBYixDQUFpQixNQUFqQixFQUF5QixPQUF6QjtNQUFILENBQWY7YUFDYixJQUFDLENBQUEsYUFBRCxDQUFlLFVBQWYsRUFBMkIsZUFBM0IsRUFBNEMsZ0JBQTVDO0lBTmtCOztzQkFRcEIsR0FBQSxHQUFLLFNBQUE7QUFDSCxVQUFBO01BREk7TUFDSixTQUFBLEdBQVk7QUFDWixXQUFBLHNDQUFBOztBQUNFLGdCQUFPLE9BQU8sR0FBZDtBQUFBLGVBQ08sUUFEUDtZQUN1QixTQUFBLElBQWE7QUFBN0I7QUFEUCxlQUVPLFFBRlA7WUFFdUIsU0FBQSxJQUFhO0FBQTdCO0FBRlAsZUFHTyxVQUhQO1lBR3VCLFNBQUEsSUFBYTtBQUhwQztBQURGO0FBS0EsY0FBTyxTQUFQO0FBQUEsYUFDTyxHQURQO0FBQUEsYUFDWSxLQURaO2lCQUN1QixJQUFDLENBQUEsYUFBRCxhQUFlLElBQWY7QUFEdkIsYUFFTyxLQUZQO0FBQUEsYUFFYyxLQUZkO1VBR0ssYUFBRCxFQUFNLGdCQUFOLEVBQWM7aUJBQ2QsSUFBQyxDQUFBLGtCQUFELENBQW9CLEdBQXBCLEVBQXlCLE1BQXpCLEVBQWlDLFFBQWpDLEVBQTJDLGVBQTNDLEVBQTRELGdCQUE1RCxFQUE4RSxPQUE5RTtBQUpKLGFBS08sTUFMUDtBQUFBLGFBS2UsTUFMZjtVQU1LLGFBQUQsRUFBTSxnQkFBTixFQUFjLGtCQUFkLEVBQXdCO2lCQUN4QixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsR0FBcEIsRUFBeUIsTUFBekIsRUFBaUMsUUFBakMsRUFBMkMsZUFBM0MsRUFBNEQsZ0JBQTVELEVBQThFLE9BQTlFO0FBUEosYUFRTyxPQVJQO0FBQUEsYUFRZ0IsT0FSaEI7VUFTSyxhQUFELEVBQU0sZ0JBQU4sRUFBYyx5QkFBZCxFQUErQiwwQkFBL0IsRUFBaUQ7aUJBQ2pELElBQUMsQ0FBQSxrQkFBRCxDQUFvQixHQUFwQixFQUF5QixNQUF6QixFQUFpQyxRQUFqQyxFQUEyQyxlQUEzQyxFQUE0RCxnQkFBNUQsRUFBOEUsT0FBOUU7QUFWSixhQVdPLFFBWFA7QUFBQSxhQVdpQixRQVhqQjtVQVlLLGFBQUQsRUFBTSxnQkFBTixFQUFjLGtCQUFkLEVBQXdCLHlCQUF4QixFQUF5QywwQkFBekMsRUFBMkQ7aUJBQzNELElBQUMsQ0FBQSxrQkFBRCxDQUFvQixHQUFwQixFQUF5QixNQUF6QixFQUFpQyxRQUFqQyxFQUEyQyxlQUEzQyxFQUE0RCxnQkFBNUQsRUFBOEUsT0FBOUU7QUFiSjtVQWVJLE9BQU8sQ0FBQyxHQUFSLENBQVksc0NBQVosRUFBb0QsSUFBcEQ7QUFmSjtJQVBHOztzQkF5QkwsTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBO01BRE87YUFDUCxRQUFBLElBQUMsQ0FBQSxXQUFELENBQVksQ0FBQyxNQUFiLGFBQW9CLElBQXBCO0lBRE07O3NCQUdSLEtBQUEsR0FBTyxTQUFBO2FBQ0wsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLENBQUE7SUFESzs7c0JBR1AsT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTtJQURPOzs7OztBQWxFWCIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuICBsaWIvc3ViLWF0b20uY29mZmVlXG4jIyNcblxue0NvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbiQgPSByZXF1aXJlICdqcXVlcnknXG5cbm1vZHVsZS5leHBvcnRzID0gXG5jbGFzcyBTdWJBdG9tXG4gIFxuICBjb25zdHJ1Y3RvcjogLT4gXG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICBhZGREaXNwb3NhYmxlOiAoZGlzcG9zYWJsZSwgZGlzcG9zZUV2ZW50T2JqLCBkaXNwb3NlRXZlbnRUeXBlKSAtPlxuICAgIGlmIGRpc3Bvc2VFdmVudE9ialxuICAgICAgdHJ5XG4gICAgICAgIGF1dG9EaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgICAgIGF1dG9EaXNwb3NhYmxlcy5hZGQgZGlzcG9zYWJsZVxuICAgICAgICBhdXRvRGlzcG9zYWJsZXMuYWRkIGRpc3Bvc2VFdmVudE9ialtkaXNwb3NlRXZlbnRUeXBlXSA9PlxuICAgICAgICAgIGF1dG9EaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICAgICAgICBAZGlzcG9zYWJsZXMucmVtb3ZlIGF1dG9EaXNwb3NhYmxlc1xuICAgICAgICBAZGlzcG9zYWJsZXMuYWRkIGF1dG9EaXNwb3NhYmxlc1xuICAgICAgY2F0Y2ggZVxuICAgICAgICBjb25zb2xlLmxvZyAnU3ViQXRvbTo6YWRkLCBpbnZhbGlkIGRpc3Bvc2UgZXZlbnQnLCBkaXNwb3NlRXZlbnRPYmosIGRpc3Bvc2VFdmVudFR5cGUsIGVcbiAgICBlbHNlXG4gICAgICBAZGlzcG9zYWJsZXMuYWRkIGRpc3Bvc2FibGVcbiAgICAgICAgXG4gIGFkZEVsZW1lbnRMaXN0ZW5lcjogKGVsZSwgZXZlbnRzLCBzZWxlY3RvciwgZGlzcG9zZUV2ZW50T2JqLCBkaXNwb3NlRXZlbnRUeXBlLCBoYW5kbGVyKSAtPlxuICAgIGlmIHNlbGVjdG9yXG4gICAgICBzdWJzY3JpcHRpb24gPSAkKGVsZSkub24gZXZlbnRzLCBzZWxlY3RvciwgaGFuZGxlclxuICAgIGVsc2VcbiAgICAgIHN1YnNjcmlwdGlvbiA9ICQoZWxlKS5vbiBldmVudHMsIGhhbmRsZXJcbiAgICBkaXNwb3NhYmxlID0gbmV3IERpc3Bvc2FibGUgLT4gc3Vic2NyaXB0aW9uLm9mZiBldmVudHMsIGhhbmRsZXJcbiAgICBAYWRkRGlzcG9zYWJsZSBkaXNwb3NhYmxlLCBkaXNwb3NlRXZlbnRPYmosIGRpc3Bvc2VFdmVudFR5cGVcbiAgXG4gIGFkZDogKGFyZ3MuLi4pIC0+XG4gICAgc2lnbmF0dXJlID0gJydcbiAgICBmb3IgYXJnIGluIGFyZ3MgXG4gICAgICBzd2l0Y2ggdHlwZW9mIGFyZ1xuICAgICAgICB3aGVuICdzdHJpbmcnICAgdGhlbiBzaWduYXR1cmUgKz0gJ3MnXG4gICAgICAgIHdoZW4gJ29iamVjdCcgICB0aGVuIHNpZ25hdHVyZSArPSAnbydcbiAgICAgICAgd2hlbiAnZnVuY3Rpb24nIHRoZW4gc2lnbmF0dXJlICs9ICdmJ1xuICAgIHN3aXRjaCBzaWduYXR1cmVcbiAgICAgIHdoZW4gJ28nLCAnb29zJyB0aGVuIEBhZGREaXNwb3NhYmxlIGFyZ3MuLi5cbiAgICAgIHdoZW4gJ3NzZicsICdvc2YnICAgICAgXG4gICAgICAgIFtlbGUsIGV2ZW50cywgaGFuZGxlcl0gPSBhcmdzXG4gICAgICAgIEBhZGRFbGVtZW50TGlzdGVuZXIgZWxlLCBldmVudHMsIHNlbGVjdG9yLCBkaXNwb3NlRXZlbnRPYmosIGRpc3Bvc2VFdmVudFR5cGUsIGhhbmRsZXJcbiAgICAgIHdoZW4gJ29zc2YnLCAnc3NzZicgICAgIFxuICAgICAgICBbZWxlLCBldmVudHMsIHNlbGVjdG9yLCBoYW5kbGVyXSA9IGFyZ3NcbiAgICAgICAgQGFkZEVsZW1lbnRMaXN0ZW5lciBlbGUsIGV2ZW50cywgc2VsZWN0b3IsIGRpc3Bvc2VFdmVudE9iaiwgZGlzcG9zZUV2ZW50VHlwZSwgaGFuZGxlclxuICAgICAgd2hlbiAnb3Nvc2YnLCAnc3Nvc2YnXG4gICAgICAgIFtlbGUsIGV2ZW50cywgZGlzcG9zZUV2ZW50T2JqLCBkaXNwb3NlRXZlbnRUeXBlLCBoYW5kbGVyXSA9IGFyZ3NcbiAgICAgICAgQGFkZEVsZW1lbnRMaXN0ZW5lciBlbGUsIGV2ZW50cywgc2VsZWN0b3IsIGRpc3Bvc2VFdmVudE9iaiwgZGlzcG9zZUV2ZW50VHlwZSwgaGFuZGxlclxuICAgICAgd2hlbiAnb3Nzb3NmJywgJ3Nzc29zZidcbiAgICAgICAgW2VsZSwgZXZlbnRzLCBzZWxlY3RvciwgZGlzcG9zZUV2ZW50T2JqLCBkaXNwb3NlRXZlbnRUeXBlLCBoYW5kbGVyXSA9IGFyZ3NcbiAgICAgICAgQGFkZEVsZW1lbnRMaXN0ZW5lciBlbGUsIGV2ZW50cywgc2VsZWN0b3IsIGRpc3Bvc2VFdmVudE9iaiwgZGlzcG9zZUV2ZW50VHlwZSwgaGFuZGxlclxuICAgICAgZWxzZSBcbiAgICAgICAgY29uc29sZS5sb2cgJ1N1YkF0b206OmFkZCwgaW52YWxpZCBjYWxsIHNpZ25hdHVyZScsIGFyZ3NcbiAgICAgICAgcmV0dXJuXG5cbiAgcmVtb3ZlOiAoYXJncy4uLikgLT4gXG4gICAgQGRpc3Bvc2FibGVzLnJlbW92ZSBhcmdzLi4uXG4gICAgXG4gIGNsZWFyOiAtPiBcbiAgICBAZGlzcG9zYWJsZXMuY2xlYXIoKVxuXG4gIGRpc3Bvc2U6IC0+IFxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiJdfQ==
