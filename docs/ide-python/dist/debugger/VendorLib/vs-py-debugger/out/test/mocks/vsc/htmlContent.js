/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const arrays_1 = require("./arrays"); // tslint:disable:all


var vscMockHtmlContent;

(function (vscMockHtmlContent) {
  class MarkdownString {
    constructor(value = '') {
      this.value = value;
    }

    appendText(value) {
      // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
      this.value += value.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&');
      return this;
    }

    appendMarkdown(value) {
      this.value += value;
      return this;
    }

    appendCodeblock(langId, code) {
      this.value += '\n```';
      this.value += langId;
      this.value += '\n';
      this.value += code;
      this.value += '\n```\n';
      return this;
    }

  }

  vscMockHtmlContent.MarkdownString = MarkdownString;

  function isEmptyMarkdownString(oneOrMany) {
    if (isMarkdownString(oneOrMany)) {
      return !oneOrMany.value;
    } else if (Array.isArray(oneOrMany)) {
      return oneOrMany.every(isEmptyMarkdownString);
    } else {
      return true;
    }
  }

  vscMockHtmlContent.isEmptyMarkdownString = isEmptyMarkdownString;

  function isMarkdownString(thing) {
    if (thing instanceof MarkdownString) {
      return true;
    } else if (thing && typeof thing === 'object') {
      return typeof thing.value === 'string' && (typeof thing.isTrusted === 'boolean' || thing.isTrusted === void 0);
    }

    return false;
  }

  vscMockHtmlContent.isMarkdownString = isMarkdownString;

  function markedStringsEquals(a, b) {
    if (!a && !b) {
      return true;
    } else if (!a || !b) {
      return false;
    } else if (Array.isArray(a) && Array.isArray(b)) {
      return arrays_1.vscMockArrays.equals(a, b, markdownStringEqual);
    } else if (isMarkdownString(a) && isMarkdownString(b)) {
      return markdownStringEqual(a, b);
    } else {
      return false;
    }
  }

  vscMockHtmlContent.markedStringsEquals = markedStringsEquals;

  function markdownStringEqual(a, b) {
    if (a === b) {
      return true;
    } else if (!a || !b) {
      return false;
    } else {
      return a.value === b.value && a.isTrusted === b.isTrusted;
    }
  }

  function removeMarkdownEscapes(text) {
    if (!text) {
      return text;
    }

    return text.replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1');
  }

  vscMockHtmlContent.removeMarkdownEscapes = removeMarkdownEscapes;
})(vscMockHtmlContent = exports.vscMockHtmlContent || (exports.vscMockHtmlContent = {}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0bWxDb250ZW50LmpzIl0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwiYXJyYXlzXzEiLCJyZXF1aXJlIiwidnNjTW9ja0h0bWxDb250ZW50IiwiTWFya2Rvd25TdHJpbmciLCJjb25zdHJ1Y3RvciIsImFwcGVuZFRleHQiLCJyZXBsYWNlIiwiYXBwZW5kTWFya2Rvd24iLCJhcHBlbmRDb2RlYmxvY2siLCJsYW5nSWQiLCJjb2RlIiwiaXNFbXB0eU1hcmtkb3duU3RyaW5nIiwib25lT3JNYW55IiwiaXNNYXJrZG93blN0cmluZyIsIkFycmF5IiwiaXNBcnJheSIsImV2ZXJ5IiwidGhpbmciLCJpc1RydXN0ZWQiLCJtYXJrZWRTdHJpbmdzRXF1YWxzIiwiYSIsImIiLCJ2c2NNb2NrQXJyYXlzIiwiZXF1YWxzIiwibWFya2Rvd25TdHJpbmdFcXVhbCIsInJlbW92ZU1hcmtkb3duRXNjYXBlcyIsInRleHQiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0FBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkMsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRUMsRUFBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsTUFBTUMsUUFBUSxHQUFHQyxPQUFPLENBQUMsVUFBRCxDQUF4QixDLENBQ0E7OztBQUNBLElBQUlDLGtCQUFKOztBQUNBLENBQUMsVUFBVUEsa0JBQVYsRUFBOEI7QUFDM0IsUUFBTUMsY0FBTixDQUFxQjtBQUNqQkMsSUFBQUEsV0FBVyxDQUFDTCxLQUFLLEdBQUcsRUFBVCxFQUFhO0FBQ3BCLFdBQUtBLEtBQUwsR0FBYUEsS0FBYjtBQUNIOztBQUNETSxJQUFBQSxVQUFVLENBQUNOLEtBQUQsRUFBUTtBQUNkO0FBQ0EsV0FBS0EsS0FBTCxJQUFjQSxLQUFLLENBQUNPLE9BQU4sQ0FBYyx1QkFBZCxFQUF1QyxNQUF2QyxDQUFkO0FBQ0EsYUFBTyxJQUFQO0FBQ0g7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LElBQXVCcUIsQ0FBQyxDQUFDRixTQUFGLEtBQWdCRyxDQUFDLENBQUNILFNBQWhEO0FBQ0g7QUFDSjs7QUFDRCxXQUFTTyxxQkFBVCxDQUErQkMsSUFBL0IsRUFBcUM7QUFDakMsUUFBSSxDQUFDQSxJQUFMLEVBQVc7QUFDUCxhQUFPQSxJQUFQO0FBQ0g7O0FBQ0QsV0FBT0EsSUFBSSxDQUFDcEIsT0FBTCxDQUFhLDJCQUFiLEVBQTBDLElBQTFDLENBQVA7QUFDSDs7QUFDREosRUFBQUEsa0JBQWtCLENBQUN1QixxQkFBbkIsR0FBMkNBLHFCQUEzQztBQUNILENBbkZELEVBbUZHdkIsa0JBQWtCLEdBQUdKLE9BQU8sQ0FBQ0ksa0JBQVIsS0FBK0JKLE9BQU8sQ0FBQ0ksa0JBQVIsR0FBNkIsRUFBNUQsQ0FuRnhCIiwic291cmNlc0NvbnRlbnQiOlsiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqICBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSBMaWNlbnNlLnR4dCBpbiB0aGUgcHJvamVjdCByb290IGZvciBsaWNlbnNlIGluZm9ybWF0aW9uLlxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4ndXNlIHN0cmljdCc7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhcnJheXNfMSA9IHJlcXVpcmUoXCIuL2FycmF5c1wiKTtcbi8vIHRzbGludDpkaXNhYmxlOmFsbFxudmFyIHZzY01vY2tIdG1sQ29udGVudDtcbihmdW5jdGlvbiAodnNjTW9ja0h0bWxDb250ZW50KSB7XG4gICAgY2xhc3MgTWFya2Rvd25TdHJpbmcge1xuICAgICAgICBjb25zdHJ1Y3Rvcih2YWx1ZSA9ICcnKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgYXBwZW5kVGV4dCh2YWx1ZSkge1xuICAgICAgICAgICAgLy8gZXNjYXBlIG1hcmtkb3duIHN5bnRheCB0b2tlbnM6IGh0dHA6Ly9kYXJpbmdmaXJlYmFsbC5uZXQvcHJvamVjdHMvbWFya2Rvd24vc3ludGF4I2JhY2tzbGFzaFxuICAgICAgICAgICAgdGhpcy52YWx1ZSArPSB2YWx1ZS5yZXBsYWNlKC9bXFxcXGAqX3t9W1xcXSgpIytcXC0uIV0vZywgJ1xcXFwkJicpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgYXBwZW5kTWFya2Rvd24odmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgKz0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBhcHBlbmRDb2RlYmxvY2sobGFuZ0lkLCBjb2RlKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlICs9ICdcXG5gYGAnO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSArPSBsYW5nSWQ7XG4gICAgICAgICAgICB0aGlzLnZhbHVlICs9ICdcXG4nO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSArPSBjb2RlO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSArPSAnXFxuYGBgXFxuJztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZzY01vY2tIdG1sQ29udGVudC5NYXJrZG93blN0cmluZyA9IE1hcmtkb3duU3RyaW5nO1xuICAgIGZ1bmN0aW9uIGlzRW1wdHlNYXJrZG93blN0cmluZyhvbmVPck1hbnkpIHtcbiAgICAgICAgaWYgKGlzTWFya2Rvd25TdHJpbmcob25lT3JNYW55KSkge1xuICAgICAgICAgICAgcmV0dXJuICFvbmVPck1hbnkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvbmVPck1hbnkpKSB7XG4gICAgICAgICAgICByZXR1cm4gb25lT3JNYW55LmV2ZXJ5KGlzRW1wdHlNYXJrZG93blN0cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB2c2NNb2NrSHRtbENvbnRlbnQuaXNFbXB0eU1hcmtkb3duU3RyaW5nID0gaXNFbXB0eU1hcmtkb3duU3RyaW5nO1xuICAgIGZ1bmN0aW9uIGlzTWFya2Rvd25TdHJpbmcodGhpbmcpIHtcbiAgICAgICAgaWYgKHRoaW5nIGluc3RhbmNlb2YgTWFya2Rvd25TdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaW5nICYmIHR5cGVvZiB0aGluZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdGhpbmcudmFsdWUgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgJiYgKHR5cGVvZiB0aGluZy5pc1RydXN0ZWQgPT09ICdib29sZWFuJyB8fCB0aGluZy5pc1RydXN0ZWQgPT09IHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2c2NNb2NrSHRtbENvbnRlbnQuaXNNYXJrZG93blN0cmluZyA9IGlzTWFya2Rvd25TdHJpbmc7XG4gICAgZnVuY3Rpb24gbWFya2VkU3RyaW5nc0VxdWFscyhhLCBiKSB7XG4gICAgICAgIGlmICghYSAmJiAhYikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWEgfHwgIWIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGEpICYmIEFycmF5LmlzQXJyYXkoYikpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheXNfMS52c2NNb2NrQXJyYXlzLmVxdWFscyhhLCBiLCBtYXJrZG93blN0cmluZ0VxdWFsKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc01hcmtkb3duU3RyaW5nKGEpICYmIGlzTWFya2Rvd25TdHJpbmcoYikpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXJrZG93blN0cmluZ0VxdWFsKGEsIGIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZzY01vY2tIdG1sQ29udGVudC5tYXJrZWRTdHJpbmdzRXF1YWxzID0gbWFya2VkU3RyaW5nc0VxdWFscztcbiAgICBmdW5jdGlvbiBtYXJrZG93blN0cmluZ0VxdWFsKGEsIGIpIHtcbiAgICAgICAgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFhIHx8ICFiKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYS52YWx1ZSA9PT0gYi52YWx1ZSAmJiBhLmlzVHJ1c3RlZCA9PT0gYi5pc1RydXN0ZWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlTWFya2Rvd25Fc2NhcGVzKHRleHQpIHtcbiAgICAgICAgaWYgKCF0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXFxcKFtcXFxcYCpfe31bXFxdKCkjK1xcLS4hXSkvZywgJyQxJyk7XG4gICAgfVxuICAgIHZzY01vY2tIdG1sQ29udGVudC5yZW1vdmVNYXJrZG93bkVzY2FwZXMgPSByZW1vdmVNYXJrZG93bkVzY2FwZXM7XG59KSh2c2NNb2NrSHRtbENvbnRlbnQgPSBleHBvcnRzLnZzY01vY2tIdG1sQ29udGVudCB8fCAoZXhwb3J0cy52c2NNb2NrSHRtbENvbnRlbnQgPSB7fSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aHRtbENvbnRlbnQuanMubWFwIl19