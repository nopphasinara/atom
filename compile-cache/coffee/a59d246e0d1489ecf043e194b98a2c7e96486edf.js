(function() {
  module.exports = {
    selector: ['.source.css', '.source.html', '.source.css.less'],
    id: 'aligner-css',
    config: {
      ':-alignment': {
        title: 'Padding for :',
        description: 'Pad left or right of the character',
        type: 'string',
        "default": 'right'
      },
      ':-leftSpace': {
        title: 'Left space for :',
        description: 'Add 1 whitespace to the left',
        type: 'boolean',
        "default": false
      },
      ':-rightSpace': {
        title: 'Right space for :',
        description: 'Add 1 whitespace to the right',
        type: 'boolean',
        "default": true
      },
      ':-scope': {
        title: 'Character scope',
        description: 'Scope string to match',
        type: 'string',
        "default": 'key-value'
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hbGlnbmVyLWNzcy9saWIvcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxDQUFDLGFBQUQsRUFBZ0IsY0FBaEIsRUFBZ0Msa0JBQWhDLENBQVY7SUFDQSxFQUFBLEVBQUksYUFESjtJQUVBLE1BQUEsRUFDRTtNQUFBLGFBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxlQUFQO1FBQ0EsV0FBQSxFQUFhLG9DQURiO1FBRUEsSUFBQSxFQUFNLFFBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE9BSFQ7T0FERjtNQUtBLGFBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxrQkFBUDtRQUNBLFdBQUEsRUFBYSw4QkFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO09BTkY7TUFVQSxjQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sbUJBQVA7UUFDQSxXQUFBLEVBQWEsK0JBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFIVDtPQVhGO01BZUEsU0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGlCQUFQO1FBQ0EsV0FBQSxFQUFhLHVCQURiO1FBRUEsSUFBQSxFQUFNLFFBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFdBSFQ7T0FoQkY7S0FIRjs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgc2VsZWN0b3I6IFsnLnNvdXJjZS5jc3MnLCAnLnNvdXJjZS5odG1sJywgJy5zb3VyY2UuY3NzLmxlc3MnXVxuICBpZDogJ2FsaWduZXItY3NzJyAjIHBhY2thZ2UgbmFtZVxuICBjb25maWc6XG4gICAgJzotYWxpZ25tZW50JzpcbiAgICAgIHRpdGxlOiAnUGFkZGluZyBmb3IgOidcbiAgICAgIGRlc2NyaXB0aW9uOiAnUGFkIGxlZnQgb3IgcmlnaHQgb2YgdGhlIGNoYXJhY3RlcidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAncmlnaHQnXG4gICAgJzotbGVmdFNwYWNlJzpcbiAgICAgIHRpdGxlOiAnTGVmdCBzcGFjZSBmb3IgOidcbiAgICAgIGRlc2NyaXB0aW9uOiAnQWRkIDEgd2hpdGVzcGFjZSB0byB0aGUgbGVmdCdcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAnOi1yaWdodFNwYWNlJzpcbiAgICAgIHRpdGxlOiAnUmlnaHQgc3BhY2UgZm9yIDonXG4gICAgICBkZXNjcmlwdGlvbjogJ0FkZCAxIHdoaXRlc3BhY2UgdG8gdGhlIHJpZ2h0J1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgJzotc2NvcGUnOlxuICAgICAgdGl0bGU6ICdDaGFyYWN0ZXIgc2NvcGUnXG4gICAgICBkZXNjcmlwdGlvbjogJ1Njb3BlIHN0cmluZyB0byBtYXRjaCdcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAna2V5LXZhbHVlJ1xuIl19
