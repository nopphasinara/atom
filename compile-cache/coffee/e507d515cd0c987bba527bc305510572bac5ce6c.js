(function() {
  module.exports = {
    name: "HTML",
    namespace: "html",
    scope: ['text.html'],

    /*
    Supported Grammars
     */
    grammars: ["HTML"],

    /*
    Supported extensions
     */
    extensions: ["html"],
    options: {
      indent_inner_html: {
        type: 'boolean',
        "default": false,
        description: "Indent <head> and <body> sections."
      },
      indent_size: {
        type: 'integer',
        "default": null,
        minimum: 0,
        description: "Indentation size/length"
      },
      indent_char: {
        type: 'string',
        "default": null,
        description: "Indentation character"
      },
      brace_style: {
        type: 'string',
        "default": "collapse",
        "enum": ["collapse", "expand", "end-expand", "none"],
        description: "[collapse|expand|end-expand|none]"
      },
      indent_scripts: {
        type: 'string',
        "default": "normal",
        "enum": ["keep", "separate", "normal"],
        description: "[keep|separate|normal]"
      },
      wrap_line_length: {
        type: 'integer',
        "default": 250,
        description: "Maximum characters per line (0 disables)"
      },
      wrap_attributes: {
        type: 'string',
        "default": "auto",
        "enum": ["auto", "aligned-multiple", "force", "force-aligned", "force-expand-multiline"],
        description: "Wrap attributes to new lines [auto|aligned-multiple|force|force-aligned|force-expand-multiline]"
      },
      wrap_attributes_indent_size: {
        type: 'integer',
        "default": null,
        minimum: 0,
        description: "Indent wrapped attributes to after N characters"
      },
      preserve_newlines: {
        type: 'boolean',
        "default": true,
        description: "Preserve line-breaks"
      },
      max_preserve_newlines: {
        type: 'integer',
        "default": 10,
        description: "Number of line-breaks to be preserved in one chunk"
      },
      unformatted: {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        description: "(Deprecated for most scenarios - consider inline or content_unformatted) List of tags that should not be reformatted at all.  NOTE: Set this to [] to get improved beautifier behavior."
      },
      inline: {
        type: 'array',
        "default": ['a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var', 'video', 'wbr', 'text', 'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt'],
        items: {
          type: 'string'
        },
        description: "List of inline tags. Behaves similar to text content, will not wrap without whitespace."
      },
      content_unformatted: {
        type: 'array',
        "default": ['pre', 'textarea'],
        items: {
          type: 'string'
        },
        description: "List of tags whose contents should not be reformatted. Attributes will be reformatted, inner html will not."
      },
      end_with_newline: {
        type: 'boolean',
        "default": false,
        description: "End output with newline"
      },
      extra_liners: {
        type: 'array',
        "default": ['head', 'body', '/html'],
        items: {
          type: 'string'
        },
        description: "List of tags (defaults to [head,body,/html] that should have an extra newline before them."
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2xhbmd1YWdlcy9odG1sLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBRWYsSUFBQSxFQUFNLE1BRlM7SUFHZixTQUFBLEVBQVcsTUFISTtJQUlmLEtBQUEsRUFBTyxDQUFDLFdBQUQsQ0FKUTs7QUFNZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsTUFEUSxDQVRLOztBQWFmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixNQURVLENBaEJHO0lBb0JmLE9BQUEsRUFDRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxvQ0FGYjtPQURGO01BSUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxPQUFBLEVBQVMsQ0FGVDtRQUdBLFdBQUEsRUFBYSx5QkFIYjtPQUxGO01BU0EsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsdUJBRmI7T0FWRjtNQWFBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxVQURUO1FBRUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLFVBQUQsRUFBYSxRQUFiLEVBQXVCLFlBQXZCLEVBQXFDLE1BQXJDLENBRk47UUFHQSxXQUFBLEVBQWEsbUNBSGI7T0FkRjtNQWtCQSxjQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsUUFEVDtRQUVBLENBQUEsSUFBQSxDQUFBLEVBQU0s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RUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLHlCQUZiO09BeEVGO01BMkVBLFlBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxPQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLE9BQWpCLENBRFQ7UUFFQSxLQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sUUFBTjtTQUhGO1FBSUEsV0FBQSxFQUFhLDRGQUpiO09BNUVGO0tBckJhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiSFRNTFwiXG4gIG5hbWVzcGFjZTogXCJodG1sXCJcbiAgc2NvcGU6IFsndGV4dC5odG1sJ11cblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiSFRNTFwiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcImh0bWxcIlxuICBdXG5cbiAgb3B0aW9uczpcbiAgICBpbmRlbnRfaW5uZXJfaHRtbDpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudCA8aGVhZD4gYW5kIDxib2R5PiBzZWN0aW9ucy5cIlxuICAgIGluZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBzaXplL2xlbmd0aFwiXG4gICAgaW5kZW50X2NoYXI6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gY2hhcmFjdGVyXCJcbiAgICBicmFjZV9zdHlsZTpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcImNvbGxhcHNlXCJcbiAgICAgIGVudW06IFtcImNvbGxhcHNlXCIsIFwiZXhwYW5kXCIsIFwiZW5kLWV4cGFuZFwiLCBcIm5vbmVcIl1cbiAgICAgIGRlc2NyaXB0aW9uOiBcIltjb2xsYXBzZXxleHBhbmR8ZW5kLWV4cGFuZHxub25lXVwiXG4gICAgaW5kZW50X3NjcmlwdHM6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJub3JtYWxcIlxuICAgICAgZW51bTogW1wia2VlcFwiLCBcInNlcGFyYXRlXCIsIFwibm9ybWFsXCJdXG4gICAgICBkZXNjcmlwdGlvbjogXCJba2VlcHxzZXBhcmF0ZXxub3JtYWxdXCJcbiAgICB3cmFwX2xpbmVfbGVuZ3RoOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAyNTBcbiAgICAgIGRlc2NyaXB0aW9uOiBcIk1heGltdW0gY2hhcmFjdGVycyBwZXIgbGluZSAoMCBkaXNhYmxlcylcIlxuICAgIHdyYXBfYXR0cmlidXRlczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcImF1dG9cIlxuICAgICAgZW51bTogW1wiYXV0b1wiLCBcImFsaWduZWQtbXVsdGlwbGVcIiwgXCJmb3JjZVwiLCBcImZvcmNlLWFsaWduZWRcIiwgXCJmb3JjZS1leHBhbmQtbXVsdGlsaW5lXCJdXG4gICAgICBkZXNjcmlwdGlvbjogXCJXcmFwIGF0dHJpYnV0ZXMgdG8gbmV3IGxpbmVzIFthdXRvfGFsaWduZWQtbXVsdGlwbGV8Zm9yY2V8Zm9yY2UtYWxpZ25lZHxmb3JjZS1leHBhbmQtbXVsdGlsaW5lXVwiXG4gICAgd3JhcF9hdHRyaWJ1dGVzX2luZGVudF9zaXplOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnQgd3JhcHBlZCBhdHRyaWJ1dGVzIHRvIGFmdGVyIE4gY2hhcmFjdGVyc1wiXG4gICAgcHJlc2VydmVfbmV3bGluZXM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlByZXNlcnZlIGxpbmUtYnJlYWtzXCJcbiAgICBtYXhfcHJlc2VydmVfbmV3bGluZXM6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDEwXG4gICAgICBkZXNjcmlwdGlvbjogXCJOdW1iZXIgb2YgbGluZS1icmVha3MgdG8gYmUgcHJlc2VydmVkIGluIG9uZSBjaHVua1wiXG4gICAgdW5mb3JtYXR0ZWQ6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZXNjcmlwdGlvbjogXCIoRGVwcmVjYXRlZCBmb3IgbW9zdCBzY2VuYXJpb3MgLSBjb25zaWRlciBpbmxpbmUgb3IgY29udGVudF91bmZvcm1hdHRlZCkgTGlzdCBvZiB0YWdzIHRoYXQgc2hvdWxkIG5vdCBiZSByZWZvcm1hdHRlZCBhdCBhbGwuICBOT1RFOiBTZXQgdGhpcyB0byBbXSB0byBnZXQgaW1wcm92ZWQgYmVhdXRpZmllciBiZWhhdmlvci5cIlxuICAgIGlubGluZTpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFtcbiAgICAgICAgICAgICdhJywgJ2FiYnInLCAnYXJlYScsICdhdWRpbycsICdiJywgJ2JkaScsICdiZG8nLCAnYnInLCAnYnV0dG9uJywgJ2NhbnZhcycsICdjaXRlJyxcbiAgICAgICAgICAgICdjb2RlJywgJ2RhdGEnLCAnZGF0YWxpc3QnLCAnZGVsJywgJ2RmbicsICdlbScsICdlbWJlZCcsICdpJywgJ2lmcmFtZScsICdpbWcnLFxuICAgICAgICAgICAgJ2lucHV0JywgJ2lucycsICdrYmQnLCAna2V5Z2VuJywgJ2xhYmVsJywgJ21hcCcsICdtYXJrJywgJ21hdGgnLCAnbWV0ZXInLCAnbm9zY3JpcHQnLFxuICAgICAgICAgICAgJ29iamVjdCcsICdvdXRwdXQnLCAncHJvZ3Jlc3MnLCAncScsICdydWJ5JywgJ3MnLCAnc2FtcCcsICdzZWxlY3QnLCAnc21hbGwnLFxuICAgICAgICAgICAgJ3NwYW4nLCAnc3Ryb25nJywgJ3N1YicsICdzdXAnLCAnc3ZnJywgJ3RlbXBsYXRlJywgJ3RleHRhcmVhJywgJ3RpbWUnLCAndScsICd2YXInLFxuICAgICAgICAgICAgJ3ZpZGVvJywgJ3dicicsICd0ZXh0JyxcbiAgICAgICAgICAgICdhY3JvbnltJywgJ2FkZHJlc3MnLCAnYmlnJywgJ2R0JywgJ2lucycsICdzdHJpa2UnLCAndHQnXG4gICAgICAgIF1cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVzY3JpcHRpb246IFwiTGlzdCBvZiBpbmxpbmUgdGFncy4gQmVoYXZlcyBzaW1pbGFyIHRvIHRleHQgY29udGVudCwgd2lsbCBub3Qgd3JhcCB3aXRob3V0IHdoaXRlc3BhY2UuXCJcbiAgICBjb250ZW50X3VuZm9ybWF0dGVkOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogWyAncHJlJywgJ3RleHRhcmVhJyBdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkxpc3Qgb2YgdGFncyB3aG9zZSBjb250ZW50cyBzaG91bGQgbm90IGJlIHJlZm9ybWF0dGVkLiBBdHRyaWJ1dGVzIHdpbGwgYmUgcmVmb3JtYXR0ZWQsIGlubmVyIGh0bWwgd2lsbCBub3QuXCJcbiAgICBlbmRfd2l0aF9uZXdsaW5lOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiRW5kIG91dHB1dCB3aXRoIG5ld2xpbmVcIlxuICAgIGV4dHJhX2xpbmVyczpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFsnaGVhZCcsICdib2R5JywgJy9odG1sJ11cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVzY3JpcHRpb246IFwiTGlzdCBvZiB0YWdzIChkZWZhdWx0cyB0byBbaGVhZCxib2R5LC9odG1sXSB0aGF0IHNob3VsZCBoYXZlIGFuIGV4dHJhIG5ld2xpbmUgYmVmb3JlIHRoZW0uXCJcblxufVxuIl19
