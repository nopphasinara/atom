(function() {
  var CompositeDisposable, FormatterJson;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = FormatterJson = {
    activate: function(state) {},
    config: {
      json: {
        title: 'JSON',
        type: 'object',
        description: 'All parameters for JSON language.',
        properties: {
          enable: {
            title: 'Enable formatter for JSON language',
            type: 'boolean',
            "default": true,
            description: 'Need restart Atom.'
          },
          indentSize: {
            title: 'Arguments passed to the formatter JSON language',
            type: 'integer',
            "default": 2,
            minimum: 0,
            description: 'Example : 8'
          }
        }
      }
    },
    provideFormatter: function() {
      if (atom.config.get('formatter-json.json.enable')) {
        return {
          selector: '.source.json',
          getNewText: function(text) {
            return new Promise(function(resolve, reject) {
              var e, toReturn;
              try {
                toReturn = JSON.stringify(JSON.parse(text), null, atom.config.get('formatter-json.json.indentSize'));
                return resolve(toReturn);
              } catch (error) {
                e = error;
                return atom.notifications.addError('formatter-json : error', {
                  dismissable: true,
                  detail: e
                });
              }
            });
          }
        };
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mb3JtYXR0ZXItanNvbi9saWIvZm9ybWF0dGVyLWpzb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGFBQUEsR0FDZjtJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQSxDQUFWO0lBR0EsTUFBQSxFQUNFO01BQUEsSUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLE1BQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLFdBQUEsRUFBYSxtQ0FGYjtRQUdBLFVBQUEsRUFDRTtVQUFBLE1BQUEsRUFDRTtZQUFBLEtBQUEsRUFBTyxvQ0FBUDtZQUNBLElBQUEsRUFBTSxTQUROO1lBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUZUO1lBR0EsV0FBQSxFQUFhLG9CQUhiO1dBREY7VUFLQSxVQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQU8saURBQVA7WUFDQSxJQUFBLEVBQU0sU0FETjtZQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FGVDtZQUdBLE9BQUEsRUFBUyxDQUhUO1lBSUEsV0FBQSxFQUFhLGFBSmI7V0FORjtTQUpGO09BREY7S0FKRjtJQXFCQSxnQkFBQSxFQUFrQixTQUFBO01BQ2hCLElBU0ssSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQVRMO2VBQUE7VUFDRSxRQUFBLEVBQVUsY0FEWjtVQUVFLFVBQUEsRUFBWSxTQUFDLElBQUQ7QUFDVixtQkFBTyxJQUFJLE9BQUosQ0FBWSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2pCLGtCQUFBO0FBQUE7Z0JBQ0UsUUFBQSxHQUFXLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWYsRUFBaUMsSUFBakMsRUFBdUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixDQUF2Qzt1QkFDWCxPQUFBLENBQVEsUUFBUixFQUZGO2VBQUEsYUFBQTtnQkFHTTt1QkFDSixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLHdCQUE1QixFQUFzRDtrQkFBQyxXQUFBLEVBQWEsSUFBZDtrQkFBb0IsTUFBQSxFQUFRLENBQTVCO2lCQUF0RCxFQUpGOztZQURpQixDQUFaO1VBREcsQ0FGZDtVQUFBOztJQURnQixDQXJCbEI7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm1hdHRlckpzb24gPVxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIHJldHVyblxuXG4gIGNvbmZpZzpcbiAgICBqc29uOlxuICAgICAgdGl0bGU6ICdKU09OJ1xuICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnQWxsIHBhcmFtZXRlcnMgZm9yIEpTT04gbGFuZ3VhZ2UuJ1xuICAgICAgcHJvcGVydGllczpcbiAgICAgICAgZW5hYmxlOlxuICAgICAgICAgIHRpdGxlOiAnRW5hYmxlIGZvcm1hdHRlciBmb3IgSlNPTiBsYW5ndWFnZSdcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdOZWVkIHJlc3RhcnQgQXRvbS4nXG4gICAgICAgIGluZGVudFNpemU6XG4gICAgICAgICAgdGl0bGU6ICdBcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBmb3JtYXR0ZXIgSlNPTiBsYW5ndWFnZSdcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgICAgICBkZWZhdWx0OiAyXG4gICAgICAgICAgbWluaW11bTogMFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRXhhbXBsZSA6IDgnXG5cbiAgcHJvdmlkZUZvcm1hdHRlcjogLT5cbiAgICB7XG4gICAgICBzZWxlY3RvcjogJy5zb3VyY2UuanNvbidcbiAgICAgIGdldE5ld1RleHQ6ICh0ZXh0KSAtPlxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgICAgICB0cnlcbiAgICAgICAgICAgIHRvUmV0dXJuID0gSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZSh0ZXh0KSwgbnVsbCwgYXRvbS5jb25maWcuZ2V0ICdmb3JtYXR0ZXItanNvbi5qc29uLmluZGVudFNpemUnKTtcbiAgICAgICAgICAgIHJlc29sdmUodG9SZXR1cm4pXG4gICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdmb3JtYXR0ZXItanNvbiA6IGVycm9yJywge2Rpc21pc3NhYmxlOiB0cnVlLCBkZXRhaWw6IGV9KTtcbiAgICB9IGlmIGF0b20uY29uZmlnLmdldCAnZm9ybWF0dGVyLWpzb24uanNvbi5lbmFibGUnXG4iXX0=
