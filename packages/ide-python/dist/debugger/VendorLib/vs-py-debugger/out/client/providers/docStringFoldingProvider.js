// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const vscode_1 = require("vscode");

const iterableTextRange_1 = require("../language/iterableTextRange");

const types_1 = require("../language/types");

const providerUtilities_1 = require("./providerUtilities");

class DocStringFoldingProvider {
  provideFoldingRanges(document, _context, token) {
    return this.getFoldingRanges(document);
  }

  getFoldingRanges(document) {
    const tokenCollection = providerUtilities_1.getDocumentTokens(document, document.lineAt(document.lineCount - 1).range.end, types_1.TokenizerMode.CommentsAndStrings);
    const tokens = new iterableTextRange_1.IterableTextRange(tokenCollection);
    const docStringRanges = [];
    const commentRanges = [];

    for (const token of tokens) {
      const docstringRange = this.getDocStringFoldingRange(document, token);

      if (docstringRange) {
        docStringRanges.push(docstringRange);
        continue;
      }

      const commentRange = this.getSingleLineCommentRange(document, token);

      if (commentRange) {
        this.buildMultiLineCommentRange(commentRange, commentRanges);
      }
    }

    this.removeLastSingleLineComment(commentRanges);
    return docStringRanges.concat(commentRanges);
  }

  buildMultiLineCommentRange(commentRange, commentRanges) {
    if (commentRanges.length === 0) {
      commentRanges.push(commentRange);
      return;
    }

    const previousComment = commentRanges[commentRanges.length - 1];

    if (previousComment.end + 1 === commentRange.start) {
      previousComment.end = commentRange.end;
      return;
    }

    if (previousComment.start === previousComment.end) {
      commentRanges[commentRanges.length - 1] = commentRange;
      return;
    }

    commentRanges.push(commentRange);
  }

  removeLastSingleLineComment(commentRanges) {
    // Remove last comment folding range if its a single line entry.
    if (commentRanges.length === 0) {
      return;
    }

    const lastComment = commentRanges[commentRanges.length - 1];

    if (lastComment.start === lastComment.end) {
      commentRanges.pop();
    }
  }

  getDocStringFoldingRange(document, token) {
    if (token.type !== types_1.TokenType.String) {
      return;
    }

    const startPosition = document.positionAt(token.start);
    const endPosition = document.positionAt(token.end);

    if (startPosition.line === endPosition.line) {
      return;
    }

    const startLine = document.lineAt(startPosition);

    if (startLine.firstNonWhitespaceCharacterIndex !== startPosition.character) {
      return;
    }

    const startIndex1 = startLine.text.indexOf('\'\'\'');
    const startIndex2 = startLine.text.indexOf('"""');

    if (startIndex1 !== startPosition.character && startIndex2 !== startPosition.character) {
      return;
    }

    const range = new vscode_1.Range(startPosition, endPosition);
    return new vscode_1.FoldingRange(range.start.line, range.end.line);
  }

  getSingleLineCommentRange(document, token) {
    if (token.type !== types_1.TokenType.Comment) {
      return;
    }

    const startPosition = document.positionAt(token.start);
    const endPosition = document.positionAt(token.end);

    if (startPosition.line !== endPosition.line) {
      return;
    }

    if (document.lineAt(startPosition).firstNonWhitespaceCharacterIndex !== startPosition.character) {
      return;
    }

    const range = new vscode_1.Range(startPosition, endPosition);
    return new vscode_1.FoldingRange(range.start.line, range.end.line, vscode_1.FoldingRangeKind.Comment);
  }

}

exports.DocStringFoldingProvider = DocStringFoldingProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvY1N0cmluZ0ZvbGRpbmdQcm92aWRlci5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsInZzY29kZV8xIiwicmVxdWlyZSIsIml0ZXJhYmxlVGV4dFJhbmdlXzEiLCJ0eXBlc18xIiwicHJvdmlkZXJVdGlsaXRpZXNfMSIsIkRvY1N0cmluZ0ZvbGRpbmdQcm92aWRlciIsInByb3ZpZGVGb2xkaW5nUmFuZ2VzIiwiZG9jdW1lbnQiLCJfY29udGV4dCIsInRva2VuIiwiZ2V0Rm9sZGluZ1JhbmdlcyIsInRva2VuQ29sbGVjdGlvbiIsImdldERvY3VtZW50VG9rZW5zIiwibGluZUF0IiwibGluZUNvdW50IiwicmFuZ2UiLCJlbmQiLCJUb2tlbml6ZXJNb2RlIiwiQ29tbWVudHNBbmRTdHJpbmdzIiwidG9rZW5zIiwiSXRlcmFibGVUZXh0UmFuZ2UiLCJkb2NTdHJpbmdSYW5nZXMiLCJjb21tZW50UmFuZ2VzIiwiZG9jc3RyaW5nUmFuZ2UiLCJnZXREb2NTdHJpbmdGb2xkaW5nUmFuZ2UiLCJwdXNoIiwiY29tbWVudFJhbmdlIiwiZ2V0U2luZ2xlTGluZUNvbW1lbnRSYW5nZSIsImJ1aWxkTXVsdGlMaW5lQ29tbWVudFJhbmdlIiwicmVtb3ZlTGFzdFNpbmdsZUxpbmVDb21tZW50IiwiY29uY2F0IiwibGVuZ3RoIiwicHJldmlvdXNDb21tZW50Iiwic3RhcnQiLCJsYXN0Q29tbWVudCIsInBvcCIsInR5cGUiLCJUb2tlblR5cGUiLCJTdHJpbmciLCJzdGFydFBvc2l0aW9uIiwicG9zaXRpb25BdCIsImVuZFBvc2l0aW9uIiwibGluZSIsInN0YXJ0TGluZSIsImZpcnN0Tm9uV2hpdGVzcGFjZUNoYXJhY3RlckluZGV4IiwiY2hhcmFjdGVyIiwic3RhcnRJbmRleDEiLCJ0ZXh0IiwiaW5kZXhPZiIsInN0YXJ0SW5kZXgyIiwiUmFuZ2UiLCJGb2xkaW5nUmFuZ2UiLCJDb21tZW50IiwiRm9sZGluZ1Jhbmdl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R0FBbUNBLHdCQUFuQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuJ3VzZSBzdHJpY3QnO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgdnNjb2RlXzEgPSByZXF1aXJlKFwidnNjb2RlXCIpO1xuY29uc3QgaXRlcmFibGVUZXh0UmFuZ2VfMSA9IHJlcXVpcmUoXCIuLi9sYW5ndWFnZS9pdGVyYWJsZVRleHRSYW5nZVwiKTtcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vbGFuZ3VhZ2UvdHlwZXNcIik7XG5jb25zdCBwcm92aWRlclV0aWxpdGllc18xID0gcmVxdWlyZShcIi4vcHJvdmlkZXJVdGlsaXRpZXNcIik7XG5jbGFzcyBEb2NTdHJpbmdGb2xkaW5nUHJvdmlkZXIge1xuICAgIHByb3ZpZGVGb2xkaW5nUmFuZ2VzKGRvY3VtZW50LCBfY29udGV4dCwgdG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Rm9sZGluZ1Jhbmdlcyhkb2N1bWVudCk7XG4gICAgfVxuICAgIGdldEZvbGRpbmdSYW5nZXMoZG9jdW1lbnQpIHtcbiAgICAgICAgY29uc3QgdG9rZW5Db2xsZWN0aW9uID0gcHJvdmlkZXJVdGlsaXRpZXNfMS5nZXREb2N1bWVudFRva2Vucyhkb2N1bWVudCwgZG9jdW1lbnQubGluZUF0KGRvY3VtZW50LmxpbmVDb3VudCAtIDEpLnJhbmdlLmVuZCwgdHlwZXNfMS5Ub2tlbml6ZXJNb2RlLkNvbW1lbnRzQW5kU3RyaW5ncyk7XG4gICAgICAgIGNvbnN0IHRva2VucyA9IG5ldyBpdGVyYWJsZVRleHRSYW5nZV8xLkl0ZXJhYmxlVGV4dFJhbmdlKHRva2VuQ29sbGVjdGlvbik7XG4gICAgICAgIGNvbnN0IGRvY1N0cmluZ1JhbmdlcyA9IFtdO1xuICAgICAgICBjb25zdCBjb21tZW50UmFuZ2VzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgdG9rZW4gb2YgdG9rZW5zKSB7XG4gICAgICAgICAgICBjb25zdCBkb2NzdHJpbmdSYW5nZSA9IHRoaXMuZ2V0RG9jU3RyaW5nRm9sZGluZ1JhbmdlKGRvY3VtZW50LCB0b2tlbik7XG4gICAgICAgICAgICBpZiAoZG9jc3RyaW5nUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICBkb2NTdHJpbmdSYW5nZXMucHVzaChkb2NzdHJpbmdSYW5nZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjb21tZW50UmFuZ2UgPSB0aGlzLmdldFNpbmdsZUxpbmVDb21tZW50UmFuZ2UoZG9jdW1lbnQsIHRva2VuKTtcbiAgICAgICAgICAgIGlmIChjb21tZW50UmFuZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkTXVsdGlMaW5lQ29tbWVudFJhbmdlKGNvbW1lbnRSYW5nZSwgY29tbWVudFJhbmdlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVMYXN0U2luZ2xlTGluZUNvbW1lbnQoY29tbWVudFJhbmdlcyk7XG4gICAgICAgIHJldHVybiBkb2NTdHJpbmdSYW5nZXMuY29uY2F0KGNvbW1lbnRSYW5nZXMpO1xuICAgIH1cbiAgICBidWlsZE11bHRpTGluZUNvbW1lbnRSYW5nZShjb21tZW50UmFuZ2UsIGNvbW1lbnRSYW5nZXMpIHtcbiAgICAgICAgaWYgKGNvbW1lbnRSYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBjb21tZW50UmFuZ2VzLnB1c2goY29tbWVudFJhbmdlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcmV2aW91c0NvbW1lbnQgPSBjb21tZW50UmFuZ2VzW2NvbW1lbnRSYW5nZXMubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmIChwcmV2aW91c0NvbW1lbnQuZW5kICsgMSA9PT0gY29tbWVudFJhbmdlLnN0YXJ0KSB7XG4gICAgICAgICAgICBwcmV2aW91c0NvbW1lbnQuZW5kID0gY29tbWVudFJhbmdlLmVuZDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJldmlvdXNDb21tZW50LnN0YXJ0ID09PSBwcmV2aW91c0NvbW1lbnQuZW5kKSB7XG4gICAgICAgICAgICBjb21tZW50UmFuZ2VzW2NvbW1lbnRSYW5nZXMubGVuZ3RoIC0gMV0gPSBjb21tZW50UmFuZ2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29tbWVudFJhbmdlcy5wdXNoKGNvbW1lbnRSYW5nZSk7XG4gICAgfVxuICAgIHJlbW92ZUxhc3RTaW5nbGVMaW5lQ29tbWVudChjb21tZW50UmFuZ2VzKSB7XG4gICAgICAgIC8vIFJlbW92ZSBsYXN0IGNvbW1lbnQgZm9sZGluZyByYW5nZSBpZiBpdHMgYSBzaW5nbGUgbGluZSBlbnRyeS5cbiAgICAgICAgaWYgKGNvbW1lbnRSYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGFzdENvbW1lbnQgPSBjb21tZW50UmFuZ2VzW2NvbW1lbnRSYW5nZXMubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmIChsYXN0Q29tbWVudC5zdGFydCA9PT0gbGFzdENvbW1lbnQuZW5kKSB7XG4gICAgICAgICAgICBjb21tZW50UmFuZ2VzLnBvcCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldERvY1N0cmluZ0ZvbGRpbmdSYW5nZShkb2N1bWVudCwgdG9rZW4pIHtcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09IHR5cGVzXzEuVG9rZW5UeXBlLlN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN0YXJ0UG9zaXRpb24gPSBkb2N1bWVudC5wb3NpdGlvbkF0KHRva2VuLnN0YXJ0KTtcbiAgICAgICAgY29uc3QgZW5kUG9zaXRpb24gPSBkb2N1bWVudC5wb3NpdGlvbkF0KHRva2VuLmVuZCk7XG4gICAgICAgIGlmIChzdGFydFBvc2l0aW9uLmxpbmUgPT09IGVuZFBvc2l0aW9uLmxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdGFydExpbmUgPSBkb2N1bWVudC5saW5lQXQoc3RhcnRQb3NpdGlvbik7XG4gICAgICAgIGlmIChzdGFydExpbmUuZmlyc3ROb25XaGl0ZXNwYWNlQ2hhcmFjdGVySW5kZXggIT09IHN0YXJ0UG9zaXRpb24uY2hhcmFjdGVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RhcnRJbmRleDEgPSBzdGFydExpbmUudGV4dC5pbmRleE9mKCdcXCdcXCdcXCcnKTtcbiAgICAgICAgY29uc3Qgc3RhcnRJbmRleDIgPSBzdGFydExpbmUudGV4dC5pbmRleE9mKCdcIlwiXCInKTtcbiAgICAgICAgaWYgKHN0YXJ0SW5kZXgxICE9PSBzdGFydFBvc2l0aW9uLmNoYXJhY3RlciAmJiBzdGFydEluZGV4MiAhPT0gc3RhcnRQb3NpdGlvbi5jaGFyYWN0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByYW5nZSA9IG5ldyB2c2NvZGVfMS5SYW5nZShzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbik7XG4gICAgICAgIHJldHVybiBuZXcgdnNjb2RlXzEuRm9sZGluZ1JhbmdlKHJhbmdlLnN0YXJ0LmxpbmUsIHJhbmdlLmVuZC5saW5lKTtcbiAgICB9XG4gICAgZ2V0U2luZ2xlTGluZUNvbW1lbnRSYW5nZShkb2N1bWVudCwgdG9rZW4pIHtcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09IHR5cGVzXzEuVG9rZW5UeXBlLkNvbW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdGFydFBvc2l0aW9uID0gZG9jdW1lbnQucG9zaXRpb25BdCh0b2tlbi5zdGFydCk7XG4gICAgICAgIGNvbnN0IGVuZFBvc2l0aW9uID0gZG9jdW1lbnQucG9zaXRpb25BdCh0b2tlbi5lbmQpO1xuICAgICAgICBpZiAoc3RhcnRQb3NpdGlvbi5saW5lICE9PSBlbmRQb3NpdGlvbi5saW5lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRvY3VtZW50LmxpbmVBdChzdGFydFBvc2l0aW9uKS5maXJzdE5vbldoaXRlc3BhY2VDaGFyYWN0ZXJJbmRleCAhPT0gc3RhcnRQb3NpdGlvbi5jaGFyYWN0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByYW5nZSA9IG5ldyB2c2NvZGVfMS5SYW5nZShzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbik7XG4gICAgICAgIHJldHVybiBuZXcgdnNjb2RlXzEuRm9sZGluZ1JhbmdlKHJhbmdlLnN0YXJ0LmxpbmUsIHJhbmdlLmVuZC5saW5lLCB2c2NvZGVfMS5Gb2xkaW5nUmFuZ2VLaW5kLkNvbW1lbnQpO1xuICAgIH1cbn1cbmV4cG9ydHMuRG9jU3RyaW5nRm9sZGluZ1Byb3ZpZGVyID0gRG9jU3RyaW5nRm9sZGluZ1Byb3ZpZGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZG9jU3RyaW5nRm9sZGluZ1Byb3ZpZGVyLmpzLm1hcCJdfQ==