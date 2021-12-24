(function() {
  var AFTERPROPS, AutoIndent, BRACE_CLOSE, BRACE_OPEN, CompositeDisposable, DidInsertText, File, JSXBRACE_CLOSE, JSXBRACE_OPEN, JSXTAG_CLOSE, JSXTAG_CLOSE_ATTRS, JSXTAG_OPEN, JSXTAG_SELFCLOSE_END, JSXTAG_SELFCLOSE_START, JS_ELSE, JS_IF, JS_RETURN, LINEALIGNED, NO_TOKEN, PAREN_CLOSE, PAREN_OPEN, PROPSALIGNED, Point, Range, SWITCH_BRACE_CLOSE, SWITCH_BRACE_OPEN, SWITCH_CASE, SWITCH_DEFAULT, TAGALIGNED, TEMPLATE_END, TEMPLATE_START, TERNARY_ELSE, TERNARY_IF, autoCompleteJSX, path, ref, stripJsonComments,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, File = ref.File, Range = ref.Range, Point = ref.Point;

  path = require('path');

  autoCompleteJSX = require('./auto-complete-jsx');

  DidInsertText = require('./did-insert-text');

  stripJsonComments = require('strip-json-comments');

  NO_TOKEN = 0;

  JSXTAG_SELFCLOSE_START = 1;

  JSXTAG_SELFCLOSE_END = 2;

  JSXTAG_OPEN = 3;

  JSXTAG_CLOSE_ATTRS = 4;

  JSXTAG_CLOSE = 5;

  JSXBRACE_OPEN = 6;

  JSXBRACE_CLOSE = 7;

  BRACE_OPEN = 8;

  BRACE_CLOSE = 9;

  TERNARY_IF = 10;

  TERNARY_ELSE = 11;

  JS_IF = 12;

  JS_ELSE = 13;

  SWITCH_BRACE_OPEN = 14;

  SWITCH_BRACE_CLOSE = 15;

  SWITCH_CASE = 16;

  SWITCH_DEFAULT = 17;

  JS_RETURN = 18;

  PAREN_OPEN = 19;

  PAREN_CLOSE = 20;

  TEMPLATE_START = 21;

  TEMPLATE_END = 22;

  TAGALIGNED = 'tag-aligned';

  LINEALIGNED = 'line-aligned';

  AFTERPROPS = 'after-props';

  PROPSALIGNED = 'props-aligned';

  module.exports = AutoIndent = (function() {
    function AutoIndent(editor) {
      this.editor = editor;
      this.onMouseUp = bind(this.onMouseUp, this);
      this.onMouseDown = bind(this.onMouseDown, this);
      this.handleOnDidStopChanging = bind(this.handleOnDidStopChanging, this);
      this.changedCursorPosition = bind(this.changedCursorPosition, this);
      this.DidInsertText = new DidInsertText(this.editor);
      this.autoJsx = atom.config.get('language-babel').autoIndentJSX;
      this.JSXREGEXP = /(<)([$_A-Za-z](?:[$_.:\-A-Za-z0-9])*)|(\/>)|(<\/)([$_A-Za-z](?:[$._:\-A-Za-z0-9])*)(>)|(>)|({)|(})|(\?)|(:)|(if)|(else)|(case)|(default)|(return)|(\()|(\))|(`)|(?:(<)\s*(>))|(<\/)(>)/g;
      this.mouseUp = true;
      this.multipleCursorTrigger = 1;
      this.disposables = new CompositeDisposable();
      this.eslintIndentOptions = this.getIndentOptions();
      this.templateDepth = 0;
      this.disposables.add(atom.config.observe('language-babel.autoIndentJSX', (function(_this) {
        return function(value) {
          return _this.autoJsx = value;
        };
      })(this)));
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'language-babel:auto-indent-jsx-on': (function(_this) {
          return function(event) {
            _this.autoJsx = true;
            return _this.eslintIndentOptions = _this.getIndentOptions();
          };
        })(this)
      }));
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'language-babel:auto-indent-jsx-off': (function(_this) {
          return function(event) {
            return _this.autoJsx = false;
          };
        })(this)
      }));
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'language-babel:toggle-auto-indent-jsx': (function(_this) {
          return function(event) {
            _this.autoJsx = !_this.autoJsx;
            if (_this.autoJsx) {
              return _this.eslintIndentOptions = _this.getIndentOptions();
            }
          };
        })(this)
      }));
      document.addEventListener('mousedown', this.onMouseDown);
      document.addEventListener('mouseup', this.onMouseUp);
      this.disposables.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function(event) {
          return _this.changedCursorPosition(event);
        };
      })(this)));
      this.handleOnDidStopChanging();
    }

    AutoIndent.prototype.destroy = function() {
      this.disposables.dispose();
      this.onDidStopChangingHandler.dispose();
      document.removeEventListener('mousedown', this.onMouseDown);
      return document.removeEventListener('mouseup', this.onMouseUp);
    };

    AutoIndent.prototype.changedCursorPosition = function(event) {
      var blankLineEndPos, bufferRow, columnToMoveTo, cursorPosition, cursorPositions, endPointOfJsx, j, len, previousRow, ref1, ref2, startPointOfJsx;
      if (!this.autoJsx) {
        return;
      }
      if (!this.mouseUp) {
        return;
      }
      if (event.oldBufferPosition.row === event.newBufferPosition.row) {
        return;
      }
      bufferRow = event.newBufferPosition.row;
      if (this.editor.hasMultipleCursors()) {
        cursorPositions = this.editor.getCursorBufferPositions();
        if (cursorPositions.length === this.multipleCursorTrigger) {
          this.multipleCursorTrigger = 1;
          bufferRow = 0;
          for (j = 0, len = cursorPositions.length; j < len; j++) {
            cursorPosition = cursorPositions[j];
            if (cursorPosition.row > bufferRow) {
              bufferRow = cursorPosition.row;
            }
          }
        } else {
          this.multipleCursorTrigger++;
          return;
        }
      } else {
        cursorPosition = event.newBufferPosition;
      }
      previousRow = event.oldBufferPosition.row;
      if (this.jsxInScope(previousRow)) {
        blankLineEndPos = (ref1 = /^\s*$/.exec(this.editor.lineTextForBufferRow(previousRow))) != null ? ref1[0].length : void 0;
        if (blankLineEndPos != null) {
          this.indentRow({
            row: previousRow,
            blockIndent: 0
          });
        }
      }
      if (!this.jsxInScope(bufferRow)) {
        return;
      }
      endPointOfJsx = new Point(bufferRow, 0);
      startPointOfJsx = autoCompleteJSX.getStartOfJSX(this.editor, cursorPosition);
      this.indentJSX(new Range(startPointOfJsx, endPointOfJsx));
      columnToMoveTo = (ref2 = /^\s*$/.exec(this.editor.lineTextForBufferRow(bufferRow))) != null ? ref2[0].length : void 0;
      if (columnToMoveTo != null) {
        return this.editor.setCursorBufferPosition([bufferRow, columnToMoveTo]);
      }
    };

    AutoIndent.prototype.didStopChanging = function() {
      var endPointOfJsx, highestRow, lowestRow, selectedRange, startPointOfJsx;
      if (!this.autoJsx) {
        return;
      }
      if (!this.mouseUp) {
        return;
      }
      selectedRange = this.editor.getSelectedBufferRange();
      if (selectedRange.start.row === selectedRange.end.row && selectedRange.start.column === selectedRange.end.column) {
        if (indexOf.call(this.editor.scopeDescriptorForBufferPosition([selectedRange.start.row, selectedRange.start.column]).getScopesArray(), 'JSXStartTagEnd') >= 0) {
          return;
        }
        if (indexOf.call(this.editor.scopeDescriptorForBufferPosition([selectedRange.start.row, selectedRange.start.column]).getScopesArray(), 'JSXEndTagStart') >= 0) {
          return;
        }
      }
      highestRow = Math.max(selectedRange.start.row, selectedRange.end.row);
      lowestRow = Math.min(selectedRange.start.row, selectedRange.end.row);
      this.onDidStopChangingHandler.dispose();
      while (highestRow >= lowestRow) {
        if (this.jsxInScope(highestRow)) {
          endPointOfJsx = new Point(highestRow, 0);
          startPointOfJsx = autoCompleteJSX.getStartOfJSX(this.editor, endPointOfJsx);
          this.indentJSX(new Range(startPointOfJsx, endPointOfJsx));
          highestRow = startPointOfJsx.row - 1;
        } else {
          highestRow = highestRow - 1;
        }
      }
      setTimeout(this.handleOnDidStopChanging, 300);
    };

    AutoIndent.prototype.handleOnDidStopChanging = function() {
      return this.onDidStopChangingHandler = this.editor.onDidStopChanging((function(_this) {
        return function() {
          return _this.didStopChanging();
        };
      })(this));
    };

    AutoIndent.prototype.jsxInScope = function(bufferRow) {
      var scopes;
      scopes = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]).getScopesArray();
      return indexOf.call(scopes, 'meta.tag.jsx') >= 0;
    };

    AutoIndent.prototype.indentJSX = function(range) {
      var blankLineEndPos, firstCharIndentation, firstTagInLineIndentation, idxOfToken, indent, indentRecalc, isFirstTagOfBlock, isFirstTokenOfLine, j, line, match, matchColumn, matchPointEnd, matchPointStart, matchRange, parentTokenIdx, ref1, ref2, ref3, results, row, stackOfTokensStillOpen, token, tokenIndentation, tokenOnThisLine, tokenStack;
      tokenStack = [];
      idxOfToken = 0;
      stackOfTokensStillOpen = [];
      indent = 0;
      isFirstTagOfBlock = true;
      this.JSXREGEXP.lastIndex = 0;
      this.templateDepth = 0;
      results = [];
      for (row = j = ref1 = range.start.row, ref2 = range.end.row; ref1 <= ref2 ? j <= ref2 : j >= ref2; row = ref1 <= ref2 ? ++j : --j) {
        isFirstTokenOfLine = true;
        tokenOnThisLine = false;
        indentRecalc = false;
        firstTagInLineIndentation = 0;
        line = this.editor.lineTextForBufferRow(row);
        while ((match = this.JSXREGEXP.exec(line)) !== null) {
          matchColumn = match.index;
          matchPointStart = new Point(row, matchColumn);
          matchPointEnd = new Point(row, matchColumn + match[0].length - 1);
          matchRange = new Range(matchPointStart, matchPointEnd);
          if (row === range.start.row && matchColumn < range.start.column) {
            continue;
          }
          if (!(token = this.getToken(row, match))) {
            continue;
          }
          firstCharIndentation = this.editor.indentationForBufferRow(row);
          if (this.editor.getSoftTabs()) {
            tokenIndentation = matchColumn / this.editor.getTabLength();
          } else {
            tokenIndentation = (function(editor) {
              var charsFound, hardTabsFound, i, k, ref3;
              this.editor = editor;
              hardTabsFound = charsFound = 0;
              for (i = k = 0, ref3 = matchColumn; 0 <= ref3 ? k < ref3 : k > ref3; i = 0 <= ref3 ? ++k : --k) {
                if ((line.substr(i, 1)) === '\t') {
                  hardTabsFound++;
                } else {
                  charsFound++;
                }
              }
              return hardTabsFound + (charsFound / this.editor.getTabLength());
            })(this.editor);
          }
          switch (token) {
            case JSXTAG_OPEN:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (isFirstTagOfBlock && (parentTokenIdx != null) && (tokenStack[parentTokenIdx].type === BRACE_OPEN || tokenStack[parentTokenIdx].type === JSXBRACE_OPEN)) {
                  firstTagInLineIndentation = tokenIndentation;
                  firstCharIndentation = this.eslintIndentOptions.jsxIndent[1] + tokenStack[parentTokenIdx].firstCharIndentation;
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: firstCharIndentation
                  });
                } else if (isFirstTagOfBlock && (parentTokenIdx != null)) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: this.getIndentOfPreviousRow(row),
                    jsxIndent: 1
                  });
                } else if ((parentTokenIdx != null) && this.ternaryTerminatesPreviousLine(row)) {
                  firstTagInLineIndentation = tokenIndentation;
                  firstCharIndentation = this.getIndentOfPreviousRow(row);
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: firstCharIndentation
                  });
                } else if (parentTokenIdx != null) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                    jsxIndent: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              isFirstTagOfBlock = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: JSXTAG_OPEN,
                name: match[2],
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tokenIndentation: tokenIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case JSXTAG_CLOSE:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                indentRecalc = this.indentRow({
                  row: row,
                  blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                });
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              isFirstTagOfBlock = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              tokenStack.push({
                type: JSXTAG_CLOSE,
                name: match[5],
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case JSXTAG_SELFCLOSE_END:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                indentRecalc = this.indentForClosingBracket(row, tokenStack[parentTokenIdx], this.eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing);
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = false;
              isFirstTokenOfLine = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              tokenStack.push({
                type: JSXTAG_SELFCLOSE_END,
                name: tokenStack[parentTokenIdx].name,
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagsAttributesIdx = idxOfToken;
                tokenStack[parentTokenIdx].type = JSXTAG_SELFCLOSE_START;
                tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case JSXTAG_CLOSE_ATTRS:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                indentRecalc = this.indentForClosingBracket(row, tokenStack[parentTokenIdx], this.eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty);
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = false;
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: JSXTAG_CLOSE_ATTRS,
                name: tokenStack[parentTokenIdx].name,
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagsAttributesIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case JSXBRACE_OPEN:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (parentTokenIdx != null) {
                  if (tokenStack[parentTokenIdx].type === JSXTAG_OPEN && tokenStack[parentTokenIdx].termsThisTagsAttributesIdx === null) {
                    indentRecalc = this.indentRow({
                      row: row,
                      blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                      jsxIndentProps: 1
                    });
                  } else {
                    indentRecalc = this.indentRow({
                      row: row,
                      blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                      jsxIndent: 1
                    });
                  }
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = true;
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: token,
                name: '',
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tokenIndentation: tokenIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case TERNARY_IF:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                if (firstCharIndentation === tokenIndentation) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: this.getIndentOfPreviousRow(row),
                    jsxIndent: 1
                  });
                } else {
                  stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                  if (parentTokenIdx != null) {
                    if (tokenStack[parentTokenIdx].type === JSXTAG_OPEN && tokenStack[parentTokenIdx].termsThisTagsAttributesIdx === null) {
                      indentRecalc = this.indentRow({
                        row: row,
                        blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                        jsxIndentProps: 1
                      });
                    } else {
                      indentRecalc = this.indentRow({
                        row: row,
                        blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                        jsxIndent: 1
                      });
                    }
                  }
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = true;
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: token,
                name: '',
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tokenIndentation: tokenIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case JSXBRACE_CLOSE:
            case TERNARY_ELSE:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                indentRecalc = this.indentRow({
                  row: row,
                  blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                });
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = false;
              isFirstTokenOfLine = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              tokenStack.push({
                type: token,
                name: '',
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case BRACE_OPEN:
            case SWITCH_BRACE_OPEN:
            case PAREN_OPEN:
            case TEMPLATE_START:
              tokenOnThisLine = true;
              if (token === TEMPLATE_START) {
                this.templateDepth++;
              }
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (isFirstTagOfBlock && (parentTokenIdx != null) && tokenStack[parentTokenIdx].type === token && tokenStack[parentTokenIdx].row === (row - 1)) {
                  tokenIndentation = firstCharIndentation = this.eslintIndentOptions.jsxIndent[1] + this.getIndentOfPreviousRow(row);
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: firstCharIndentation
                  });
                } else if ((parentTokenIdx != null) && this.ternaryTerminatesPreviousLine(row)) {
                  firstTagInLineIndentation = tokenIndentation;
                  firstCharIndentation = this.getIndentOfPreviousRow(row);
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: firstCharIndentation
                  });
                } else if (parentTokenIdx != null) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                    jsxIndent: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: token,
                name: '',
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tokenIndentation: tokenIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case BRACE_CLOSE:
            case SWITCH_BRACE_CLOSE:
            case PAREN_CLOSE:
            case TEMPLATE_END:
              if (token === SWITCH_BRACE_CLOSE) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (tokenStack[parentTokenIdx].type === SWITCH_CASE || tokenStack[parentTokenIdx].type === SWITCH_DEFAULT) {
                  stackOfTokensStillOpen.pop();
                }
              }
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (parentTokenIdx != null) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              if (parentTokenIdx != null) {
                tokenStack.push({
                  type: token,
                  name: '',
                  row: row,
                  parentTokenIdx: parentTokenIdx
                });
                if (parentTokenIdx >= 0) {
                  tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
                }
                idxOfToken++;
              }
              if (token === TEMPLATE_END) {
                this.templateDepth--;
              }
              break;
            case SWITCH_CASE:
            case SWITCH_DEFAULT:
              tokenOnThisLine = true;
              isFirstTagOfBlock = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (parentTokenIdx != null) {
                  if (tokenStack[parentTokenIdx].type === SWITCH_CASE || tokenStack[parentTokenIdx].type === SWITCH_DEFAULT) {
                    indentRecalc = this.indentRow({
                      row: row,
                      blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                    });
                    stackOfTokensStillOpen.pop();
                  } else if (tokenStack[parentTokenIdx].type === SWITCH_BRACE_OPEN) {
                    indentRecalc = this.indentRow({
                      row: row,
                      blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                      jsxIndent: 1
                    });
                  }
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: token,
                name: '',
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tokenIndentation: tokenIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case JS_IF:
            case JS_ELSE:
            case JS_RETURN:
              isFirstTagOfBlock = true;
          }
        }
        if (idxOfToken && !tokenOnThisLine) {
          if (row !== range.end.row) {
            blankLineEndPos = (ref3 = /^\s*$/.exec(this.editor.lineTextForBufferRow(row))) != null ? ref3[0].length : void 0;
            if (blankLineEndPos != null) {
              results.push(this.indentRow({
                row: row,
                blockIndent: 0
              }));
            } else {
              results.push(this.indentUntokenisedLine(row, tokenStack, stackOfTokensStillOpen));
            }
          } else {
            results.push(this.indentUntokenisedLine(row, tokenStack, stackOfTokensStillOpen));
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    AutoIndent.prototype.indentUntokenisedLine = function(row, tokenStack, stackOfTokensStillOpen) {
      var parentTokenIdx, token;
      stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
      if (parentTokenIdx == null) {
        return;
      }
      token = tokenStack[parentTokenIdx];
      switch (token.type) {
        case JSXTAG_OPEN:
        case JSXTAG_SELFCLOSE_START:
          if (token.termsThisTagsAttributesIdx === null) {
            return this.indentRow({
              row: row,
              blockIndent: token.firstCharIndentation,
              jsxIndentProps: 1
            });
          } else {
            return this.indentRow({
              row: row,
              blockIndent: token.firstCharIndentation,
              jsxIndent: 1
            });
          }
          break;
        case JSXBRACE_OPEN:
        case TERNARY_IF:
          return this.indentRow({
            row: row,
            blockIndent: token.firstCharIndentation,
            jsxIndent: 1,
            allowAdditionalIndents: true
          });
        case BRACE_OPEN:
        case SWITCH_BRACE_OPEN:
        case PAREN_OPEN:
          return this.indentRow({
            row: row,
            blockIndent: token.firstCharIndentation,
            jsxIndent: 1,
            allowAdditionalIndents: true
          });
        case JSXTAG_SELFCLOSE_END:
        case JSXBRACE_CLOSE:
        case JSXTAG_CLOSE_ATTRS:
        case TERNARY_ELSE:
          return this.indentRow({
            row: row,
            blockIndent: tokenStack[token.parentTokenIdx].firstCharIndentation,
            jsxIndentProps: 1
          });
        case BRACE_CLOSE:
        case SWITCH_BRACE_CLOSE:
        case PAREN_CLOSE:
          return this.indentRow({
            row: row,
            blockIndent: tokenStack[token.parentTokenIdx].firstCharIndentation,
            jsxIndent: 1,
            allowAdditionalIndents: true
          });
        case SWITCH_CASE:
        case SWITCH_DEFAULT:
          return this.indentRow({
            row: row,
            blockIndent: token.firstCharIndentation,
            jsxIndent: 1
          });
        case TEMPLATE_START:
        case TEMPLATE_END:
      }
    };

    AutoIndent.prototype.getToken = function(bufferRow, match) {
      var scope;
      scope = this.editor.scopeDescriptorForBufferPosition([bufferRow, match.index]).getScopesArray().pop();
      if ('punctuation.definition.tag.jsx' === scope) {
        if ((match[1] != null) || (match[20] != null)) {
          return JSXTAG_OPEN;
        } else if (match[3] != null) {
          return JSXTAG_SELFCLOSE_END;
        }
      } else if ('JSXEndTagStart' === scope) {
        if ((match[4] != null) || (match[22] != null)) {
          return JSXTAG_CLOSE;
        }
      } else if ('JSXStartTagEnd' === scope) {
        if ((match[7] != null) || (match[21] != null)) {
          return JSXTAG_CLOSE_ATTRS;
        }
      } else if (match[8] != null) {
        if ('punctuation.section.embedded.begin.jsx' === scope) {
          return JSXBRACE_OPEN;
        } else if ('meta.brace.curly.switchStart.js' === scope) {
          return SWITCH_BRACE_OPEN;
        } else if ('meta.brace.curly.js' === scope || 'meta.brace.curly.litobj.js' === scope) {
          return BRACE_OPEN;
        }
      } else if (match[9] != null) {
        if ('punctuation.section.embedded.end.jsx' === scope) {
          return JSXBRACE_CLOSE;
        } else if ('meta.brace.curly.switchEnd.js' === scope) {
          return SWITCH_BRACE_CLOSE;
        } else if ('meta.brace.curly.js' === scope || 'meta.brace.curly.litobj.js' === scope) {
          return BRACE_CLOSE;
        }
      } else if (match[10] != null) {
        if ('keyword.operator.ternary.js' === scope) {
          return TERNARY_IF;
        }
      } else if (match[11] != null) {
        if ('keyword.operator.ternary.js' === scope) {
          return TERNARY_ELSE;
        }
      } else if (match[12] != null) {
        if ('keyword.control.conditional.js' === scope) {
          return JS_IF;
        }
      } else if (match[13] != null) {
        if ('keyword.control.conditional.js' === scope) {
          return JS_ELSE;
        }
      } else if (match[14] != null) {
        if ('keyword.control.switch.js' === scope) {
          return SWITCH_CASE;
        }
      } else if (match[15] != null) {
        if ('keyword.control.switch.js' === scope) {
          return SWITCH_DEFAULT;
        }
      } else if (match[16] != null) {
        if ('keyword.control.flow.js' === scope) {
          return JS_RETURN;
        }
      } else if (match[17] != null) {
        if ('meta.brace.round.js' === scope || 'meta.brace.round.graphql' === scope || 'meta.brace.round.directive.graphql' === scope) {
          return PAREN_OPEN;
        }
      } else if (match[18] != null) {
        if ('meta.brace.round.js' === scope || 'meta.brace.round.graphql' === scope || 'meta.brace.round.directive.graphql' === scope) {
          return PAREN_CLOSE;
        }
      } else if (match[19] != null) {
        if ('punctuation.definition.quasi.begin.js' === scope) {
          return TEMPLATE_START;
        }
        if ('punctuation.definition.quasi.end.js' === scope) {
          return TEMPLATE_END;
        }
      }
      return NO_TOKEN;
    };

    AutoIndent.prototype.getIndentOfPreviousRow = function(row) {
      var j, line, ref1;
      if (!row) {
        return 0;
      }
      for (row = j = ref1 = row - 1; ref1 <= 0 ? j < 0 : j > 0; row = ref1 <= 0 ? ++j : --j) {
        line = this.editor.lineTextForBufferRow(row);
        if (/.*\S/.test(line)) {
          return this.editor.indentationForBufferRow(row);
        }
      }
      return 0;
    };

    AutoIndent.prototype.getIndentOptions = function() {
      var eslintrcFilename;
      if (!this.autoJsx) {
        return this.translateIndentOptions();
      }
      if (eslintrcFilename = this.getEslintrcFilename()) {
        eslintrcFilename = new File(eslintrcFilename);
        return this.translateIndentOptions(this.readEslintrcOptions(eslintrcFilename.getPath()));
      } else {
        return this.translateIndentOptions({});
      }
    };

    AutoIndent.prototype.getEslintrcFilename = function() {
      var projectContainingSource;
      projectContainingSource = atom.project.relativizePath(this.editor.getPath());
      if (projectContainingSource[0] != null) {
        return path.join(projectContainingSource[0], '.eslintrc');
      }
    };

    AutoIndent.prototype.onMouseDown = function() {
      return this.mouseUp = false;
    };

    AutoIndent.prototype.onMouseUp = function() {
      return this.mouseUp = true;
    };

    AutoIndent.prototype.readEslintrcOptions = function(eslintrcFile) {
      var YAML, err, eslintRules, fileContent, fs;
      fs = require('fs-plus');
      if (fs.isFileSync(eslintrcFile)) {
        fileContent = stripJsonComments(fs.readFileSync(eslintrcFile, 'utf8'));
        try {
          YAML = require('js-yaml');
          eslintRules = (YAML.safeLoad(fileContent)).rules;
          if (eslintRules) {
            return eslintRules;
          }
        } catch (error) {
          err = error;
          atom.notifications.addError("LB: Error reading .eslintrc at " + eslintrcFile, {
            dismissable: true,
            detail: "" + err.message
          });
        }
      }
      return {};
    };

    AutoIndent.prototype.translateIndentOptions = function(eslintRules) {
      var ES_DEFAULT_INDENT, defaultIndent, eslintIndentOptions, rule;
      eslintIndentOptions = {
        jsxIndent: [1, 1],
        jsxIndentProps: [1, 1],
        jsxClosingBracketLocation: [
          1, {
            selfClosing: TAGALIGNED,
            nonEmpty: TAGALIGNED
          }
        ]
      };
      if (typeof eslintRules !== "object") {
        return eslintIndentOptions;
      }
      ES_DEFAULT_INDENT = 4;
      rule = eslintRules['indent'];
      if (typeof rule === 'number' || typeof rule === 'string') {
        defaultIndent = ES_DEFAULT_INDENT / this.editor.getTabLength();
      } else if (typeof rule === 'object') {
        if (typeof rule[1] === 'number') {
          defaultIndent = rule[1] / this.editor.getTabLength();
        } else {
          defaultIndent = 1;
        }
      } else {
        defaultIndent = 1;
      }
      rule = eslintRules['react/jsx-indent'];
      if (typeof rule === 'number' || typeof rule === 'string') {
        eslintIndentOptions.jsxIndent[0] = rule;
        eslintIndentOptions.jsxIndent[1] = ES_DEFAULT_INDENT / this.editor.getTabLength();
      } else if (typeof rule === 'object') {
        eslintIndentOptions.jsxIndent[0] = rule[0];
        if (typeof rule[1] === 'number') {
          eslintIndentOptions.jsxIndent[1] = rule[1] / this.editor.getTabLength();
        } else {
          eslintIndentOptions.jsxIndent[1] = 1;
        }
      } else {
        eslintIndentOptions.jsxIndent[1] = defaultIndent;
      }
      rule = eslintRules['react/jsx-indent-props'];
      if (typeof rule === 'number' || typeof rule === 'string') {
        eslintIndentOptions.jsxIndentProps[0] = rule;
        eslintIndentOptions.jsxIndentProps[1] = ES_DEFAULT_INDENT / this.editor.getTabLength();
      } else if (typeof rule === 'object') {
        eslintIndentOptions.jsxIndentProps[0] = rule[0];
        if (typeof rule[1] === 'number') {
          eslintIndentOptions.jsxIndentProps[1] = rule[1] / this.editor.getTabLength();
        } else {
          eslintIndentOptions.jsxIndentProps[1] = 1;
        }
      } else {
        eslintIndentOptions.jsxIndentProps[1] = defaultIndent;
      }
      rule = eslintRules['react/jsx-closing-bracket-location'];
      if (typeof rule === 'number' || typeof rule === 'string') {
        eslintIndentOptions.jsxClosingBracketLocation[0] = rule;
      } else if (typeof rule === 'object') {
        eslintIndentOptions.jsxClosingBracketLocation[0] = rule[0];
        if (typeof rule[1] === 'string') {
          eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing = eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty = rule[1];
        } else {
          if (rule[1].selfClosing != null) {
            eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing = rule[1].selfClosing;
          }
          if (rule[1].nonEmpty != null) {
            eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty = rule[1].nonEmpty;
          }
        }
      }
      return eslintIndentOptions;
    };

    AutoIndent.prototype.ternaryTerminatesPreviousLine = function(row) {
      var line, match, scope;
      row--;
      if (!(row >= 0)) {
        return false;
      }
      line = this.editor.lineTextForBufferRow(row);
      match = /:\s*$/.exec(line);
      if (match === null) {
        return false;
      }
      scope = this.editor.scopeDescriptorForBufferPosition([row, match.index]).getScopesArray().pop();
      if (scope !== 'keyword.operator.ternary.js') {
        return false;
      }
      return true;
    };

    AutoIndent.prototype.indentForClosingBracket = function(row, parentTag, closingBracketRule) {
      if (this.eslintIndentOptions.jsxClosingBracketLocation[0]) {
        if (closingBracketRule === TAGALIGNED) {
          return this.indentRow({
            row: row,
            blockIndent: parentTag.tokenIndentation
          });
        } else if (closingBracketRule === LINEALIGNED) {
          return this.indentRow({
            row: row,
            blockIndent: parentTag.firstCharIndentation
          });
        } else if (closingBracketRule === AFTERPROPS) {
          if (this.eslintIndentOptions.jsxIndentProps[0]) {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.firstCharIndentation,
              jsxIndentProps: 1
            });
          } else {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.firstCharIndentation
            });
          }
        } else if (closingBracketRule === PROPSALIGNED) {
          if (this.eslintIndentOptions.jsxIndentProps[0]) {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.tokenIndentation,
              jsxIndentProps: 1
            });
          } else {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.tokenIndentation
            });
          }
        }
      }
    };

    AutoIndent.prototype.indentRow = function(options) {
      var allowAdditionalIndents, blockIndent, jsxIndent, jsxIndentProps, row;
      row = options.row, allowAdditionalIndents = options.allowAdditionalIndents, blockIndent = options.blockIndent, jsxIndent = options.jsxIndent, jsxIndentProps = options.jsxIndentProps;
      if (this.templateDepth > 0) {
        return false;
      }
      if (jsxIndent) {
        if (this.eslintIndentOptions.jsxIndent[0]) {
          if (this.eslintIndentOptions.jsxIndent[1]) {
            blockIndent += jsxIndent * this.eslintIndentOptions.jsxIndent[1];
          }
        }
      }
      if (jsxIndentProps) {
        if (this.eslintIndentOptions.jsxIndentProps[0]) {
          if (this.eslintIndentOptions.jsxIndentProps[1]) {
            blockIndent += jsxIndentProps * this.eslintIndentOptions.jsxIndentProps[1];
          }
        }
      }
      if (allowAdditionalIndents) {
        if (this.editor.indentationForBufferRow(row) < blockIndent || this.editor.indentationForBufferRow(row) > blockIndent + allowAdditionalIndents) {
          this.editor.setIndentationForBufferRow(row, blockIndent, {
            preserveLeadingWhitespace: false
          });
          return true;
        }
      } else {
        if (this.editor.indentationForBufferRow(row) !== blockIndent) {
          this.editor.setIndentationForBufferRow(row, blockIndent, {
            preserveLeadingWhitespace: false
          });
          return true;
        }
      }
      return false;
    };

    return AutoIndent;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL2xpYi9hdXRvLWluZGVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG1mQUFBO0lBQUE7OztFQUFBLE1BQTRDLE9BQUEsQ0FBUSxNQUFSLENBQTVDLEVBQUMsNkNBQUQsRUFBc0IsZUFBdEIsRUFBNEIsaUJBQTVCLEVBQW1DOztFQUNuQyxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVI7O0VBQ2xCLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSOztFQUNoQixpQkFBQSxHQUFvQixPQUFBLENBQVEscUJBQVI7O0VBR3BCLFFBQUEsR0FBMEI7O0VBQzFCLHNCQUFBLEdBQTBCOztFQUMxQixvQkFBQSxHQUEwQjs7RUFDMUIsV0FBQSxHQUEwQjs7RUFDMUIsa0JBQUEsR0FBMEI7O0VBQzFCLFlBQUEsR0FBMEI7O0VBQzFCLGFBQUEsR0FBMEI7O0VBQzFCLGNBQUEsR0FBMEI7O0VBQzFCLFVBQUEsR0FBMEI7O0VBQzFCLFdBQUEsR0FBMEI7O0VBQzFCLFVBQUEsR0FBMEI7O0VBQzFCLFlBQUEsR0FBMEI7O0VBQzFCLEtBQUEsR0FBMEI7O0VBQzFCLE9BQUEsR0FBMEI7O0VBQzFCLGlCQUFBLEdBQTBCOztFQUMxQixrQkFBQSxHQUEwQjs7RUFDMUIsV0FBQSxHQUEwQjs7RUFDMUIsY0FBQSxHQUEwQjs7RUFDMUIsU0FBQSxHQUEwQjs7RUFDMUIsVUFBQSxHQUEwQjs7RUFDMUIsV0FBQSxHQUEwQjs7RUFDMUIsY0FBQSxHQUEwQjs7RUFDMUIsWUFBQSxHQUEwQjs7RUFHMUIsVUFBQSxHQUFnQjs7RUFDaEIsV0FBQSxHQUFnQjs7RUFDaEIsVUFBQSxHQUFnQjs7RUFDaEIsWUFBQSxHQUFnQjs7RUFFaEIsTUFBTSxDQUFDLE9B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Q0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBZ0MsR0FBaEMsQ0FBQSxLQUEwQyxXQUE3QztVQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMsMEJBQVIsQ0FBbUMsR0FBbkMsRUFBd0MsV0FBeEMsRUFBcUQ7WUFBRSx5QkFBQSxFQUEyQixLQUE3QjtXQUFyRDtBQUNBLGlCQUFPLEtBRlQ7U0FORjs7QUFTQSxhQUFPO0lBeEJFOzs7OztBQXIwQmIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRmlsZSwgUmFuZ2UsIFBvaW50fSA9IHJlcXVpcmUgJ2F0b20nXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmF1dG9Db21wbGV0ZUpTWCA9IHJlcXVpcmUgJy4vYXV0by1jb21wbGV0ZS1qc3gnXG5EaWRJbnNlcnRUZXh0ID0gcmVxdWlyZSAnLi9kaWQtaW5zZXJ0LXRleHQnXG5zdHJpcEpzb25Db21tZW50cyA9IHJlcXVpcmUgJ3N0cmlwLWpzb24tY29tbWVudHMnXG5cblxuTk9fVE9LRU4gICAgICAgICAgICAgICAgPSAwXG5KU1hUQUdfU0VMRkNMT1NFX1NUQVJUICA9IDEgICAgICAgIyB0aGUgPHRhZyBpbiA8dGFnIC8+XG5KU1hUQUdfU0VMRkNMT1NFX0VORCAgICA9IDIgICAgICAgIyB0aGUgLz4gaW4gPHRhZyAvPlxuSlNYVEFHX09QRU4gICAgICAgICAgICAgPSAzICAgICAgICMgdGhlIDx0YWcgaW4gPHRhZz48L3RhZz5cbkpTWFRBR19DTE9TRV9BVFRSUyAgICAgID0gNCAgICAgICAjIHRoZSAxc3QgPiBpbiA8dGFnPjwvdGFnPlxuSlNYVEFHX0NMT1NFICAgICAgICAgICAgPSA1ICAgICAgICMgYSA8L3RhZz5cbkpTWEJSQUNFX09QRU4gICAgICAgICAgID0gNiAgICAgICAjIGVtYmVkZGVkIGV4cHJlc3Npb24gYnJhY2Ugc3RhcnQge1xuSlNYQlJBQ0VfQ0xPU0UgICAgICAgICAgPSA3ICAgICAgICMgZW1iZWRkZWQgZXhwcmVzc2lvbiBicmFjZSBlbmQgfVxuQlJBQ0VfT1BFTiAgICAgICAgICAgICAgPSA4ICAgICAgICMgSmF2YXNjcmlwdCBicmFjZVxuQlJBQ0VfQ0xPU0UgICAgICAgICAgICAgPSA5ICAgICAgICMgSmF2YXNjcmlwdCBicmFjZVxuVEVSTkFSWV9JRiAgICAgICAgICAgICAgPSAxMCAgICAgICMgVGVybmFyeSA/XG5URVJOQVJZX0VMU0UgICAgICAgICAgICA9IDExICAgICAgIyBUZXJuYXJ5IDpcbkpTX0lGICAgICAgICAgICAgICAgICAgID0gMTIgICAgICAjIEpTIElGXG5KU19FTFNFICAgICAgICAgICAgICAgICA9IDEzICAgICAgIyBKUyBFTFNFXG5TV0lUQ0hfQlJBQ0VfT1BFTiAgICAgICA9IDE0ICAgICAgIyBvcGVuaW5nIGJyYWNlIGluIHN3aXRjaCB7IH1cblNXSVRDSF9CUkFDRV9DTE9TRSAgICAgID0gMTUgICAgICAjIGNsb3NpbmcgYnJhY2UgaW4gc3dpdGNoIHsgfVxuU1dJVENIX0NBU0UgICAgICAgICAgICAgPSAxNiAgICAgICMgc3dpdGNoIGNhc2Ugc3RhdGVtZW50XG5TV0lUQ0hfREVGQVVMVCAgICAgICAgICA9IDE3ICAgICAgIyBzd2l0Y2ggZGVmYXVsdCBzdGF0ZW1lbnRcbkpTX1JFVFVSTiAgICAgICAgICAgICAgID0gMTggICAgICAjIEpTIHJldHVyblxuUEFSRU5fT1BFTiAgICAgICAgICAgICAgPSAxOSAgICAgICMgcGFyZW4gb3BlbiAoXG5QQVJFTl9DTE9TRSAgICAgICAgICAgICA9IDIwICAgICAgIyBwYXJlbiBjbG9zZSApXG5URU1QTEFURV9TVEFSVCAgICAgICAgICA9IDIxICAgICAgIyBgIGJhY2stdGljayBzdGFydFxuVEVNUExBVEVfRU5EICAgICAgICAgICAgPSAyMiAgICAgICMgYCBiYWNrLXRpY2sgZW5kXG5cbiMgZXNsaW50IHByb3BlcnR5IHZhbHVlc1xuVEFHQUxJR05FRCAgICA9ICd0YWctYWxpZ25lZCdcbkxJTkVBTElHTkVEICAgPSAnbGluZS1hbGlnbmVkJ1xuQUZURVJQUk9QUyAgICA9ICdhZnRlci1wcm9wcydcblBST1BTQUxJR05FRCAgPSAncHJvcHMtYWxpZ25lZCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQXV0b0luZGVudFxuICBjb25zdHJ1Y3RvcjogKEBlZGl0b3IpIC0+XG4gICAgQERpZEluc2VydFRleHQgPSBuZXcgRGlkSW5zZXJ0VGV4dChAZWRpdG9yKVxuICAgIEBhdXRvSnN4ID0gYXRvbS5jb25maWcuZ2V0KCdsYW5ndWFnZS1iYWJlbCcpLmF1dG9JbmRlbnRKU1hcbiAgICAjIHJlZ2V4IHRvIHNlYXJjaCBmb3IgdGFnIG9wZW4vY2xvc2UgdGFnIGFuZCBjbG9zZSB0YWdcbiAgICBASlNYUkVHRVhQID0gLyg8KShbJF9BLVphLXpdKD86WyRfLjpcXC1BLVphLXowLTldKSopfChcXC8+KXwoPFxcLykoWyRfQS1aYS16XSg/OlskLl86XFwtQS1aYS16MC05XSkqKSg+KXwoPil8KHspfCh9KXwoXFw/KXwoOil8KGlmKXwoZWxzZSl8KGNhc2UpfChkZWZhdWx0KXwocmV0dXJuKXwoXFwoKXwoXFwpKXwoYCl8KD86KDwpXFxzKig+KSl8KDxcXC8pKD4pL2dcbiAgICBAbW91c2VVcCA9IHRydWVcbiAgICBAbXVsdGlwbGVDdXJzb3JUcmlnZ2VyID0gMVxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBAZXNsaW50SW5kZW50T3B0aW9ucyA9IEBnZXRJbmRlbnRPcHRpb25zKClcbiAgICBAdGVtcGxhdGVEZXB0aCA9IDAgIyB0cmFjayBkZXB0aCBvZiBhbnkgZW1iZWRkZWQgYmFjay10aWNrIHRlbXBsYXRlc1xuXG4gICAgIyBPYnNlcnZlIGF1dG9JbmRlbnRKU1ggZm9yIGV4aXN0aW5nIGVkaXRvcnNcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ2xhbmd1YWdlLWJhYmVsLmF1dG9JbmRlbnRKU1gnLFxuICAgICAgKHZhbHVlKSA9PiBAYXV0b0pzeCA9IHZhbHVlXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJyxcbiAgICAgICdsYW5ndWFnZS1iYWJlbDphdXRvLWluZGVudC1qc3gtb24nOiAoZXZlbnQpID0+XG4gICAgICAgIEBhdXRvSnN4ID0gdHJ1ZVxuICAgICAgICBAZXNsaW50SW5kZW50T3B0aW9ucyA9IEBnZXRJbmRlbnRPcHRpb25zKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLFxuICAgICAgJ2xhbmd1YWdlLWJhYmVsOmF1dG8taW5kZW50LWpzeC1vZmYnOiAoZXZlbnQpID0+ICBAYXV0b0pzeCA9IGZhbHNlXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJyxcbiAgICAgICdsYW5ndWFnZS1iYWJlbDp0b2dnbGUtYXV0by1pbmRlbnQtanN4JzogKGV2ZW50KSA9PlxuICAgICAgICBAYXV0b0pzeCA9IG5vdCBAYXV0b0pzeFxuICAgICAgICBpZiBAYXV0b0pzeCB0aGVuIEBlc2xpbnRJbmRlbnRPcHRpb25zID0gQGdldEluZGVudE9wdGlvbnMoKVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnbW91c2Vkb3duJywgQG9uTW91c2VEb3duXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnbW91c2V1cCcsIEBvbk1vdXNlVXBcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uIChldmVudCkgPT4gQGNoYW5nZWRDdXJzb3JQb3NpdGlvbihldmVudClcbiAgICBAaGFuZGxlT25EaWRTdG9wQ2hhbmdpbmcoKVxuXG4gIGRlc3Ryb3k6ICgpIC0+XG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIEBvbkRpZFN0b3BDaGFuZ2luZ0hhbmRsZXIuZGlzcG9zZSgpXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciAnbW91c2Vkb3duJywgQG9uTW91c2VEb3duXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciAnbW91c2V1cCcsIEBvbk1vdXNlVXBcblxuICAjIGNoYW5nZWQgY3Vyc29yIHBvc2l0aW9uXG4gIGNoYW5nZWRDdXJzb3JQb3NpdGlvbjogKGV2ZW50KSA9PlxuICAgIHJldHVybiB1bmxlc3MgQGF1dG9Kc3hcbiAgICByZXR1cm4gdW5sZXNzIEBtb3VzZVVwXG4gICAgcmV0dXJuIHVubGVzcyBldmVudC5vbGRCdWZmZXJQb3NpdGlvbi5yb3cgaXNudCBldmVudC5uZXdCdWZmZXJQb3NpdGlvbi5yb3dcbiAgICBidWZmZXJSb3cgPSBldmVudC5uZXdCdWZmZXJQb3NpdGlvbi5yb3dcbiAgICAjIGhhbmRsZSBtdWx0aXBsZSBjdXJzb3JzLiBvbmx5IHRyaWdnZXIgaW5kZW50IG9uIG9uZSBjaGFuZ2UgZXZlbnRcbiAgICAjIGFuZCB0aGVuIG9ubHkgYXQgdGhlIGhpZ2hlc3Qgcm93XG4gICAgaWYgQGVkaXRvci5oYXNNdWx0aXBsZUN1cnNvcnMoKVxuICAgICAgY3Vyc29yUG9zaXRpb25zID0gQGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKVxuICAgICAgaWYgY3Vyc29yUG9zaXRpb25zLmxlbmd0aCBpcyBAbXVsdGlwbGVDdXJzb3JUcmlnZ2VyXG4gICAgICAgIEBtdWx0aXBsZUN1cnNvclRyaWdnZXIgPSAxXG4gICAgICAgIGJ1ZmZlclJvdyA9IDBcbiAgICAgICAgZm9yIGN1cnNvclBvc2l0aW9uIGluIGN1cnNvclBvc2l0aW9uc1xuICAgICAgICAgIGlmIGN1cnNvclBvc2l0aW9uLnJvdyA+IGJ1ZmZlclJvdyB0aGVuIGJ1ZmZlclJvdyA9IGN1cnNvclBvc2l0aW9uLnJvd1xuICAgICAgZWxzZVxuICAgICAgICBAbXVsdGlwbGVDdXJzb3JUcmlnZ2VyKytcbiAgICAgICAgcmV0dXJuXG4gICAgZWxzZSBjdXJzb3JQb3NpdGlvbiA9IGV2ZW50Lm5ld0J1ZmZlclBvc2l0aW9uXG5cbiAgICAjIHJlbW92ZSBhbnkgYmxhbmsgbGluZXMgZnJvbSB3aGVyZSBjdXJzb3Igd2FzIHByZXZpb3VzbHlcbiAgICBwcmV2aW91c1JvdyA9IGV2ZW50Lm9sZEJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgIGlmIEBqc3hJblNjb3BlKHByZXZpb3VzUm93KVxuICAgICAgYmxhbmtMaW5lRW5kUG9zID0gL15cXHMqJC8uZXhlYyhAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHByZXZpb3VzUm93KSk/WzBdLmxlbmd0aFxuICAgICAgaWYgYmxhbmtMaW5lRW5kUG9zP1xuICAgICAgICBAaW5kZW50Um93KHtyb3c6IHByZXZpb3VzUm93ICwgYmxvY2tJbmRlbnQ6IDAgfSlcblxuICAgIHJldHVybiBpZiBub3QgQGpzeEluU2NvcGUgYnVmZmVyUm93XG5cbiAgICBlbmRQb2ludE9mSnN4ID0gbmV3IFBvaW50IGJ1ZmZlclJvdywwICMgbmV4dCByb3cgc3RhcnRcbiAgICBzdGFydFBvaW50T2ZKc3ggPSAgYXV0b0NvbXBsZXRlSlNYLmdldFN0YXJ0T2ZKU1ggQGVkaXRvciwgY3Vyc29yUG9zaXRpb25cbiAgICBAaW5kZW50SlNYIG5ldyBSYW5nZShzdGFydFBvaW50T2ZKc3gsIGVuZFBvaW50T2ZKc3gpXG4gICAgY29sdW1uVG9Nb3ZlVG8gPSAvXlxccyokLy5leGVjKEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coYnVmZmVyUm93KSk/WzBdLmxlbmd0aFxuICAgIGlmIGNvbHVtblRvTW92ZVRvPyB0aGVuIEBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gW2J1ZmZlclJvdywgY29sdW1uVG9Nb3ZlVG9dXG5cblxuICAjIEJ1ZmZlciBoYXMgc3RvcHBlZCBjaGFuZ2luZy4gSW5kZW50IGFzIHJlcXVpcmVkXG4gIGRpZFN0b3BDaGFuZ2luZzogKCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIEBhdXRvSnN4XG4gICAgcmV0dXJuIHVubGVzcyBAbW91c2VVcFxuICAgIHNlbGVjdGVkUmFuZ2UgPSBAZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKVxuICAgICMgaWYgdGhpcyBpcyBhIHRhZyBzdGFydCdzIGVuZCA+IG9yIDwvIHRoZW4gZG9uJ3QgYXV0byBpbmRlbnRcbiAgICAjIHRoaXMgaWEgZml4IHRvIGFsbG93IGZvciB0aGUgYXV0byBjb21wbGV0ZSB0YWcgdGltZSB0byBwb3AgdXBcbiAgICBpZiBzZWxlY3RlZFJhbmdlLnN0YXJ0LnJvdyBpcyBzZWxlY3RlZFJhbmdlLmVuZC5yb3cgYW5kXG4gICAgICBzZWxlY3RlZFJhbmdlLnN0YXJ0LmNvbHVtbiBpcyBzZWxlY3RlZFJhbmdlLmVuZC5jb2x1bW5cbiAgICAgICAgcmV0dXJuIGlmICdKU1hTdGFydFRhZ0VuZCcgaW4gQGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihbc2VsZWN0ZWRSYW5nZS5zdGFydC5yb3csIHNlbGVjdGVkUmFuZ2Uuc3RhcnQuY29sdW1uXSkuZ2V0U2NvcGVzQXJyYXkoKVxuICAgICAgICByZXR1cm4gaWYgJ0pTWEVuZFRhZ1N0YXJ0JyBpbiBAZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFtzZWxlY3RlZFJhbmdlLnN0YXJ0LnJvdywgc2VsZWN0ZWRSYW5nZS5zdGFydC5jb2x1bW5dKS5nZXRTY29wZXNBcnJheSgpXG5cbiAgICBoaWdoZXN0Um93ID0gTWF0aC5tYXggc2VsZWN0ZWRSYW5nZS5zdGFydC5yb3csIHNlbGVjdGVkUmFuZ2UuZW5kLnJvd1xuICAgIGxvd2VzdFJvdyA9IE1hdGgubWluIHNlbGVjdGVkUmFuZ2Uuc3RhcnQucm93LCBzZWxlY3RlZFJhbmdlLmVuZC5yb3dcblxuICAgICMgcmVtb3ZlIHRoZSBoYW5kbGVyIGZvciBkaWRTdG9wQ2hhbmdpbmcgdG8gYXZvaWQgdGhpcyBjaGFuZ2UgY2F1c2luZyBhIG5ldyBldmVudFxuICAgIEBvbkRpZFN0b3BDaGFuZ2luZ0hhbmRsZXIuZGlzcG9zZSgpXG5cbiAgICAjIHdvcmsgYmFja3dhcmRzIHRocm91Z2ggYnVmZmVyIHJvd3MgaW5kZW50aW5nIEpTWCBhcyBuZWVkZWRcbiAgICB3aGlsZSAoIGhpZ2hlc3RSb3cgPj0gbG93ZXN0Um93IClcbiAgICAgIGlmIEBqc3hJblNjb3BlKGhpZ2hlc3RSb3cpXG4gICAgICAgIGVuZFBvaW50T2ZKc3ggPSBuZXcgUG9pbnQgaGlnaGVzdFJvdywwXG4gICAgICAgIHN0YXJ0UG9pbnRPZkpzeCA9ICBhdXRvQ29tcGxldGVKU1guZ2V0U3RhcnRPZkpTWCBAZWRpdG9yLCBlbmRQb2ludE9mSnN4XG4gICAgICAgIEBpbmRlbnRKU1ggbmV3IFJhbmdlKHN0YXJ0UG9pbnRPZkpzeCwgZW5kUG9pbnRPZkpzeClcbiAgICAgICAgaGlnaGVzdFJvdyA9IHN0YXJ0UG9pbnRPZkpzeC5yb3cgLSAxXG4gICAgICBlbHNlIGhpZ2hlc3RSb3cgPSBoaWdoZXN0Um93IC0gMVxuXG4gICAgIyByZW5hYmxlIHRoaXMgZXZlbnQgaGFuZGxlciBhZnRlciAzMDBtcyBhcyBwZXIgdGhlIGRlZmF1bHQgdGltZW91dCBmb3IgY2hhbmdlIGV2ZW50c1xuICAgICMgdG8gYXZvaWQgdGhpcyBtZXRob2QgYmVpbmcgcmVjYWxsZWQhXG4gICAgc2V0VGltZW91dChAaGFuZGxlT25EaWRTdG9wQ2hhbmdpbmcsIDMwMClcbiAgICByZXR1cm5cblxuICBoYW5kbGVPbkRpZFN0b3BDaGFuZ2luZzogPT5cbiAgICBAb25EaWRTdG9wQ2hhbmdpbmdIYW5kbGVyID0gQGVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZyAoKSA9PiBAZGlkU3RvcENoYW5naW5nKClcblxuICAjIGlzIHRoZSBqc3ggb24gdGhpcyBsaW5lIGluIHNjb3BlXG4gIGpzeEluU2NvcGU6IChidWZmZXJSb3cpIC0+XG4gICAgc2NvcGVzID0gQGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihbYnVmZmVyUm93LCAwXSkuZ2V0U2NvcGVzQXJyYXkoKVxuICAgIHJldHVybiAnbWV0YS50YWcuanN4JyBpbiBzY29wZXNcblxuICAjIGluZGVudCB0aGUgSlNYIGluIHRoZSAncmFuZ2UnIG9mIHJvd3NcbiAgIyBUaGlzIGlzIGRlc2lnbmVkIHRvIGJlIGEgc2luZ2xlIHBhcnNlIGluZGVudGVyIHRvIHJlZHVjZSB0aGUgaW1wYWN0IG9uIHRoZSBlZGl0b3IuXG4gICMgSXQgYXNzdW1lcyB0aGUgZ3JhbW1hciBoYXMgZG9uZSBpdHMgam9iIGFkZGluZyBzY29wZXMgdG8gaW50ZXJlc3RpbmcgdG9rZW5zLlxuICAjIFRob3NlIGFyZSBKU1ggPHRhZywgPiwgPC90YWcsIC8+LCBlbWVkZGVkIGV4cHJlc3Npb25zXG4gICMgb3V0c2lkZSB0aGUgdGFnIHN0YXJ0aW5nIHsgYW5kIGVuZGluZyB9IGFuZCBqYXZhc2NyaXB0IGJyYWNlcyBvdXRzaWRlIGEgdGFnIHsgJiB9XG4gICMgaXQgdXNlcyBhbiBhcnJheSB0byBob2xkIHRva2VucyBhbmQgYSBwdXNoL3BvcCBzdGFjayB0byBob2xkIHRva2VucyBub3QgY2xvc2VkXG4gICMgdGhlIHZlcnkgZmlyc3QganN4IHRhZyBtdXN0IGJlIGNvcnJldGx5IGluZGV0ZWQgYnkgdGhlIHVzZXIgYXMgd2UgZG9uJ3QgaGF2ZVxuICAjIGtub3dsZWRnZSBvZiBwcmVjZWVkaW5nIEphdmFzY3JpcHQuXG4gIGluZGVudEpTWDogKHJhbmdlKSAtPlxuICAgIHRva2VuU3RhY2sgPSBbXVxuICAgIGlkeE9mVG9rZW4gPSAwXG4gICAgc3RhY2tPZlRva2Vuc1N0aWxsT3BlbiA9IFtdICMgbGVuZ3RoIGVxdWl2YWxlbnQgdG8gdG9rZW4gZGVwdGhcbiAgICBpbmRlbnQgPSAgMFxuICAgIGlzRmlyc3RUYWdPZkJsb2NrID0gdHJ1ZVxuICAgIEBKU1hSRUdFWFAubGFzdEluZGV4ID0gMFxuICAgIEB0ZW1wbGF0ZURlcHRoID0gMFxuXG4gICAgZm9yIHJvdyBpbiBbcmFuZ2Uuc3RhcnQucm93Li5yYW5nZS5lbmQucm93XVxuICAgICAgaXNGaXJzdFRva2VuT2ZMaW5lID0gdHJ1ZVxuICAgICAgdG9rZW5PblRoaXNMaW5lID0gZmFsc2VcbiAgICAgIGluZGVudFJlY2FsYyA9IGZhbHNlXG4gICAgICBmaXJzdFRhZ0luTGluZUluZGVudGF0aW9uID0gIDBcbiAgICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93IHJvd1xuXG4gICAgICAjIGxvb2sgZm9yIHRva2VucyBpbiBhIGJ1ZmZlciBsaW5lXG4gICAgICB3aGlsZSAoKCBtYXRjaCA9IEBKU1hSRUdFWFAuZXhlYyhsaW5lKSkgaXNudCBudWxsIClcbiAgICAgICAgbWF0Y2hDb2x1bW4gPSBtYXRjaC5pbmRleFxuICAgICAgICBtYXRjaFBvaW50U3RhcnQgPSBuZXcgUG9pbnQocm93LCBtYXRjaENvbHVtbilcbiAgICAgICAgbWF0Y2hQb2ludEVuZCA9IG5ldyBQb2ludChyb3csIG1hdGNoQ29sdW1uICsgbWF0Y2hbMF0ubGVuZ3RoIC0gMSlcbiAgICAgICAgbWF0Y2hSYW5nZSA9IG5ldyBSYW5nZShtYXRjaFBvaW50U3RhcnQsIG1hdGNoUG9pbnRFbmQpXG5cbiAgICAgICAgaWYgcm93IGlzIHJhbmdlLnN0YXJ0LnJvdyBhbmQgbWF0Y2hDb2x1bW4gPCByYW5nZS5zdGFydC5jb2x1bW4gdGhlbiBjb250aW51ZVxuICAgICAgICBpZiBub3QgdG9rZW4gPSAgQGdldFRva2VuKHJvdywgbWF0Y2gpIHRoZW4gY29udGludWVcblxuICAgICAgICBmaXJzdENoYXJJbmRlbnRhdGlvbiA9IChAZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93IHJvdylcbiAgICAgICAgIyBjb252ZXJ0IHRoZSBtYXRjaGVkIGNvbHVtbiBwb3NpdGlvbiBpbnRvIHRhYiBpbmRlbnRzXG4gICAgICAgIGlmIEBlZGl0b3IuZ2V0U29mdFRhYnMoKVxuICAgICAgICAgIHRva2VuSW5kZW50YXRpb24gPSAobWF0Y2hDb2x1bW4gLyBAZWRpdG9yLmdldFRhYkxlbmd0aCgpKVxuICAgICAgICBlbHNlIHRva2VuSW5kZW50YXRpb24gPVxuICAgICAgICAgIGRvIChAZWRpdG9yKSAtPlxuICAgICAgICAgICAgaGFyZFRhYnNGb3VuZCA9IGNoYXJzRm91bmQgPSAwXG4gICAgICAgICAgICBmb3IgaSBpbiBbMC4uLm1hdGNoQ29sdW1uXVxuICAgICAgICAgICAgICBpZiAoKGxpbmUuc3Vic3RyIGksIDEpIGlzICdcXHQnKVxuICAgICAgICAgICAgICAgIGhhcmRUYWJzRm91bmQrK1xuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2hhcnNGb3VuZCsrXG4gICAgICAgICAgICByZXR1cm4gaGFyZFRhYnNGb3VuZCArICggY2hhcnNGb3VuZCAvIEBlZGl0b3IuZ2V0VGFiTGVuZ3RoKCkgKVxuXG4gICAgICAgICMgYmlnIHN3aXRjaCBzdGF0ZW1lbnQgZm9sbG93cyBmb3IgZWFjaCB0b2tlbi4gSWYgdGhlIGxpbmUgaXMgcmVmb3JtYXRlZFxuICAgICAgICAjIHRoZW4gd2UgcmVjYWxjdWxhdGUgdGhlIG5ldyBwb3NpdGlvbi5cbiAgICAgICAgIyBiaXQgaG9ycmlkIGJ1dCBob3BlZnVsbHkgZmFzdC5cbiAgICAgICAgc3dpdGNoICh0b2tlbilcbiAgICAgICAgICAjIHRhZ3Mgc3RhcnRpbmcgPHRhZ1xuICAgICAgICAgIHdoZW4gSlNYVEFHX09QRU5cbiAgICAgICAgICAgIHRva2VuT25UaGlzTGluZSA9IHRydWVcbiAgICAgICAgICAgICMgaW5kZW50IG9ubHkgb24gZmlyc3QgdG9rZW4gb2YgYSBsaW5lXG4gICAgICAgICAgICBpZiBpc0ZpcnN0VG9rZW5PZkxpbmVcbiAgICAgICAgICAgICAgc3RhY2tPZlRva2Vuc1N0aWxsT3Blbi5wdXNoIHBhcmVudFRva2VuSWR4ID0gc3RhY2tPZlRva2Vuc1N0aWxsT3Blbi5wb3AoKVxuICAgICAgICAgICAgICAjIGlzRmlyc3RUYWdPZkJsb2NrIGlzIHVzZWQgdG8gbWFyayB0aGUgdGFnIHRoYXQgc3RhcnRzIHRoZSBKU1ggYnV0XG4gICAgICAgICAgICAgICMgYWxzbyB0aGUgZmlyc3QgdGFnIG9mIGJsb2NrcyBpbnNpZGUgIGVtYmVkZGVkIGV4cHJlc3Npb25zLiBlLmcuXG4gICAgICAgICAgICAgICMgPHRib2R5PiwgPHBDb21wPiBhbmQgPG9iamVjdFJvdz4gYXJlIGZpcnN0IHRhZ3NcbiAgICAgICAgICAgICAgIyByZXR1cm4gKFxuICAgICAgICAgICAgICAjICAgICAgIDx0Ym9keSBjb21wPXs8cENvbXAgcHJvcGVydHkgLz59PlxuICAgICAgICAgICAgICAjICAgICAgICAge29iamVjdHMubWFwKGZ1bmN0aW9uKG9iamVjdCwgaSl7XG4gICAgICAgICAgICAgICMgICAgICAgICAgIHJldHVybiA8T2JqZWN0Um93IG9iaj17b2JqZWN0fSBrZXk9e2l9IC8+O1xuICAgICAgICAgICAgICAjICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICMgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgIyAgICAgKVxuICAgICAgICAgICAgICAjIGJ1dCB3ZSBkb24ndCBwb3NpdGlvbiB0aGUgPHRib2R5PiBhcyB3ZSBoYXZlIG5vIGtub3dsZWRnZSBvZiB0aGUgcHJlY2VlZGluZ1xuICAgICAgICAgICAgICAjIGpzIHN5bnRheFxuICAgICAgICAgICAgICBpZiBpc0ZpcnN0VGFnT2ZCbG9jayBhbmRcbiAgICAgICAgICAgICAgICAgIHBhcmVudFRva2VuSWR4PyBhbmRcbiAgICAgICAgICAgICAgICAgICggdG9rZW5TdGFja1twYXJlbnRUb2tlbklkeF0udHlwZSBpcyBCUkFDRV9PUEVOIG9yXG4gICAgICAgICAgICAgICAgICB0b2tlblN0YWNrW3BhcmVudFRva2VuSWR4XS50eXBlIGlzIEpTWEJSQUNFX09QRU4gKVxuICAgICAgICAgICAgICAgICAgICBmaXJzdFRhZ0luTGluZUluZGVudGF0aW9uID0gIHRva2VuSW5kZW50YXRpb25cbiAgICAgICAgICAgICAgICAgICAgZmlyc3RDaGFySW5kZW50YXRpb24gPVxuICAgICAgICAgICAgICAgICAgICAgIEBlc2xpbnRJbmRlbnRPcHRpb25zLmpzeEluZGVudFsxXSArIHRva2VuU3RhY2tbcGFyZW50VG9rZW5JZHhdLmZpcnN0Q2hhckluZGVudGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGluZGVudFJlY2FsYyA9IEBpbmRlbnRSb3coe3Jvdzogcm93ICwgYmxvY2tJbmRlbnQ6IGZpcnN0Q2hhckluZGVudGF0aW9uIH0pXG4gICAgICAgICAgICAgIGVsc2UgaWYgaXNGaXJzdFRhZ09mQmxvY2sgYW5kIHBhcmVudFRva2VuSWR4P1xuICAgICAgICAgICAgICAgIGluZGVudFJlY2FsYyA9IEBpbmRlbnRSb3coe3Jvdzogcm93ICwgYmxvY2tJbmRlbnQ6IEBnZXRJbmRlbnRPZlByZXZpb3VzUm93KHJvdyksIGpzeEluZGVudDogMX0pXG4gICAgICAgICAgICAgIGVsc2UgaWYgcGFyZW50VG9rZW5JZHg/IGFuZCBAdGVybmFyeVRlcm1pbmF0ZXNQcmV2aW91c0xpbmUocm93KVxuICAgICAgICAgICAgICAgIGZpcnN0VGFnSW5MaW5lSW5kZW50YXRpb24gPSAgdG9rZW5JbmRlbnRhdGlvblxuICAgICAgICAgICAgICAgIGZpcnN0Q2hhckluZGVudGF0aW9uID0gQGdldEluZGVudE9mUHJldmlvdXNSb3cocm93KVxuICAgICAgICAgICAgICAgIGluZGVudFJlY2FsYyA9IEBpbmRlbnRSb3coe3Jvdzogcm93ICwgYmxvY2tJbmRlbnQ6IGZpcnN0Q2hhckluZGVudGF0aW9uIH0pXG4gICAgICAgICAgICAgIGVsc2UgaWYgcGFyZW50VG9rZW5JZHg/XG4gICAgICAgICAgICAgICAgaW5kZW50UmVjYWxjID0gQGluZGVudFJvdyh7cm93OiByb3cgLCBibG9ja0luZGVudDogdG9rZW5TdGFja1twYXJlbnRUb2tlbklkeF0uZmlyc3RDaGFySW5kZW50YXRpb24sIGpzeEluZGVudDogMX0pXG5cbiAgICAgICAgICAgICMgcmUtcGFyc2UgbGluZSBpZiBpbmRlbnQgZGlkIHNvbWV0aGluZyB0byBpdFxuICAgICAgICAgICAgaWYgaW5kZW50UmVjYWxjXG4gICAgICAgICAgICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93IHJvd1xuICAgICAgICAgICAgICBASlNYUkVHRVhQLmxhc3RJbmRleCA9IDAgI2ZvcmNlIHJlZ2V4IHRvIHN0YXJ0IGFnYWluXG4gICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgIGlzRmlyc3RUb2tlbk9mTGluZSA9IGZhbHNlXG4gICAgICAgICAgICBpc0ZpcnN0VGFnT2ZCbG9jayA9IGZhbHNlXG5cbiAgICAgICAgICAgIHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucHVzaCBwYXJlbnRUb2tlbklkeCA9IHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcbiAgICAgICAgICAgIHRva2VuU3RhY2sucHVzaFxuICAgICAgICAgICAgICB0eXBlOiBKU1hUQUdfT1BFTlxuICAgICAgICAgICAgICBuYW1lOiBtYXRjaFsyXVxuICAgICAgICAgICAgICByb3c6IHJvd1xuICAgICAgICAgICAgICBmaXJzdFRhZ0luTGluZUluZGVudGF0aW9uOiBmaXJzdFRhZ0luTGluZUluZGVudGF0aW9uXG4gICAgICAgICAgICAgIHRva2VuSW5kZW50YXRpb246IHRva2VuSW5kZW50YXRpb25cbiAgICAgICAgICAgICAgZmlyc3RDaGFySW5kZW50YXRpb246IGZpcnN0Q2hhckluZGVudGF0aW9uXG4gICAgICAgICAgICAgIHBhcmVudFRva2VuSWR4OiBwYXJlbnRUb2tlbklkeFxuICAgICAgICAgICAgICB0ZXJtc1RoaXNUYWdzQXR0cmlidXRlc0lkeDogbnVsbCAgIyBwdHIgdG8gPiB0YWdcbiAgICAgICAgICAgICAgdGVybXNUaGlzVGFnSWR4OiBudWxsICAgICAgICAgICAgICMgcHRyIHRvIDwvdGFnPlxuXG4gICAgICAgICAgICBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnB1c2ggaWR4T2ZUb2tlblxuICAgICAgICAgICAgaWR4T2ZUb2tlbisrXG5cbiAgICAgICAgICAjIHRhZ3MgZW5kaW5nIDwvdGFnPlxuICAgICAgICAgIHdoZW4gSlNYVEFHX0NMT1NFXG4gICAgICAgICAgICB0b2tlbk9uVGhpc0xpbmUgPSB0cnVlXG4gICAgICAgICAgICBpZiBpc0ZpcnN0VG9rZW5PZkxpbmVcbiAgICAgICAgICAgICAgc3RhY2tPZlRva2Vuc1N0aWxsT3Blbi5wdXNoIHBhcmVudFRva2VuSWR4ID0gc3RhY2tPZlRva2Vuc1N0aWxsT3Blbi5wb3AoKVxuICAgICAgICAgICAgICBpbmRlbnRSZWNhbGMgPSBAaW5kZW50Um93KHtyb3c6IHJvdywgYmxvY2tJbmRlbnQ6IHRva2VuU3RhY2tbcGFyZW50VG9rZW5JZHhdLmZpcnN0Q2hhckluZGVudGF0aW9uIH0gKVxuXG4gICAgICAgICAgICAjIHJlLXBhcnNlIGxpbmUgaWYgaW5kZW50IGRpZCBzb21ldGhpbmcgdG8gaXRcbiAgICAgICAgICAgIGlmIGluZGVudFJlY2FsY1xuICAgICAgICAgICAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyByb3dcbiAgICAgICAgICAgICAgQEpTWFJFR0VYUC5sYXN0SW5kZXggPSAwICNmb3JjZSByZWdleCB0byBzdGFydCBhZ2FpblxuICAgICAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgICAgICBpc0ZpcnN0VG9rZW5PZkxpbmUgPSBmYWxzZVxuICAgICAgICAgICAgaXNGaXJzdFRhZ09mQmxvY2sgPSBmYWxzZVxuXG4gICAgICAgICAgICBwYXJlbnRUb2tlbklkeCA9IHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcbiAgICAgICAgICAgIHRva2VuU3RhY2sucHVzaFxuICAgICAgICAgICAgICB0eXBlOiBKU1hUQUdfQ0xPU0VcbiAgICAgICAgICAgICAgbmFtZTogbWF0Y2hbNV1cbiAgICAgICAgICAgICAgcm93OiByb3dcbiAgICAgICAgICAgICAgcGFyZW50VG9rZW5JZHg6IHBhcmVudFRva2VuSWR4ICAgICAgICAgIyBwdHIgdG8gPHRhZ1xuICAgICAgICAgICAgaWYgcGFyZW50VG9rZW5JZHggPj0wIHRoZW4gdG9rZW5TdGFja1twYXJlbnRUb2tlbklkeF0udGVybXNUaGlzVGFnSWR4ID0gaWR4T2ZUb2tlblxuICAgICAgICAgICAgaWR4T2ZUb2tlbisrXG5cbiAgICAgICAgICAjIHRhZ3MgZW5kaW5nIC8+XG4gICAgICAgICAgd2hlbiBKU1hUQUdfU0VMRkNMT1NFX0VORFxuICAgICAgICAgICAgdG9rZW5PblRoaXNMaW5lID0gdHJ1ZVxuICAgICAgICAgICAgaWYgaXNGaXJzdFRva2VuT2ZMaW5lXG4gICAgICAgICAgICAgIHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucHVzaCBwYXJlbnRUb2tlbklkeCA9IHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcbiAgICAgICAgICAgICAgI2lmIGZpcnN0VGFnSW5MaW5lSW5kZW50YXRpb24gaXMgZmlyc3RDaGFySW5kZW50YXRpb25cbiAgICAgICAgICAgICAgaW5kZW50UmVjYWxjID0gQGluZGVudEZvckNsb3NpbmdCcmFja2V0ICByb3csXG4gICAgICAgICAgICAgICAgdG9rZW5TdGFja1twYXJlbnRUb2tlbklkeF0sXG4gICAgICAgICAgICAgICAgQGVzbGludEluZGVudE9wdGlvbnMuanN4Q2xvc2luZ0JyYWNrZXRMb2NhdGlvblsxXS5zZWxmQ2xvc2luZ1xuXG4gICAgICAgICAgICAjIHJlLXBhcnNlIGxpbmUgaWYgaW5kZW50IGRpZCBzb21ldGhpbmcgdG8gaXRcbiAgICAgICAgICAgIGlmIGluZGVudFJlY2FsY1xuICAgICAgICAgICAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyByb3dcbiAgICAgICAgICAgICAgQEpTWFJFR0VYUC5sYXN0SW5kZXggPSAwICNmb3JjZSByZWdleCB0byBzdGFydCBhZ2FpblxuICAgICAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgICAgICBpc0ZpcnN0VGFnT2ZCbG9jayA9IGZhbHNlXG4gICAgICAgICAgICBpc0ZpcnN0VG9rZW5PZkxpbmUgPSBmYWxzZVxuXG4gICAgICAgICAgICBwYXJlbnRUb2tlbklkeCA9IHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcbiAgICAgICAgICAgIHRva2VuU3RhY2sucHVzaFxuICAgICAgICAgICAgICB0eXBlOiBKU1hUQUdfU0VMRkNMT1NFX0VORFxuICAgICAgICAgICAgICBuYW1lOiB0b2tlblN0YWNrW3BhcmVudFRva2VuSWR4XS5uYW1lXG4gICAgICAgICAgICAgIHJvdzogcm93XG4gICAgICAgICAgICAgIHBhcmVudFRva2VuSWR4OiBwYXJlbnRUb2tlbklkeCAgICAgICAjIHB0ciB0byA8dGFnXG4gICAgICAgICAgICBpZiBwYXJlbnRUb2tlbklkeCA+PSAwXG4gICAgICAgICAgICAgIHRva2VuU3RhY2tbcGFyZW50VG9rZW5JZHhdLnRlcm1zVGhpc1RhZ3NBdHRyaWJ1dGVzSWR4ID0gaWR4T2ZUb2tlblxuICAgICAgICAgICAgICB0b2tlblN0YWNrW3BhcmVudFRva2VuSWR4XS50eXBlID0gSlNYVEFHX1NFTEZDTE9TRV9TVEFSVFxuICAgICAgICAgICAgICB0b2tlblN0YWNrW3BhcmVudFRva2VuSWR4XS50ZXJtc1RoaXNUYWdJZHggPSBpZHhPZlRva2VuXG4gICAgICAgICAgICBpZHhPZlRva2VuKytcblxuICAgICAgICAgICMgdGFncyBlbmRpbmcgPlxuICAgICAgICAgIHdoZW4gSlNYVEFHX0NMT1NFX0FUVFJTXG4gICAgICAgICAgICB0b2tlbk9uVGhpc0xpbmUgPSB0cnVlXG4gICAgICAgICAgICBpZiBpc0ZpcnN0VG9rZW5PZkxpbmVcbiAgICAgICAgICAgICAgc3RhY2tPZlRva2Vuc1N0aWxsT3Blbi5wdXNoIHBhcmVudFRva2VuSWR4ID0gc3RhY2tPZlRva2Vuc1N0aWxsT3Blbi5wb3AoKVxuICAgICAgICAgICAgICAjaWYgdG9rZW5TdGFja1twYXJlbnRUb2tlbklkeF0uZmlyc3RUYWdJbkxpbmVJbmRlbnRhdGlvbiBpcyBmaXJzdENoYXJJbmRlbnRhdGlvblxuICAgICAgICAgICAgICBpbmRlbnRSZWNhbGMgPSBAaW5kZW50Rm9yQ2xvc2luZ0JyYWNrZXQgIHJvdyxcbiAgICAgICAgICAgICAgICB0b2tlblN0YWNrW3BhcmVudFRva2VuSWR4XSxcbiAgICAgICAgICAgICAgICBAZXNsaW50SW5kZW50T3B0aW9ucy5qc3hDbG9zaW5nQnJhY2tldExvY2F0aW9uWzFdLm5vbkVtcHR5XG5cbiAgICAgICAgICAgICMgcmUtcGFyc2UgbGluZSBpZiBpbmRlbnQgZGlkIHNvbWV0aGluZyB0byBpdFxuICAgICAgICAgICAgaWYgaW5kZW50UmVjYWxjXG4gICAgICAgICAgICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93IHJvd1xuICAgICAgICAgICAgICBASlNYUkVHRVhQLmxhc3RJbmRleCA9IDAgI2ZvcmNlIHJlZ2V4IHRvIHN0YXJ0IGFnYWluXG4gICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgIGlzRmlyc3RUYWdPZkJsb2NrID0gZmFsc2VcbiAgICAgICAgICAgIGlzRmlyc3RUb2tlbk9mTGluZSA9IGZhbHNlXG5cbiAgICAgICAgICAgIHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucHVzaCBwYXJlbnRUb2tlbklkeCA9IHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcbiAgICAgICAgICAgIHRva2VuU3RhY2sucHVzaFxuICAgICAgICAgICAgICB0eXBlOiBKU1hUQUdfQ0xPU0VfQVRUUlNcbiAgICAgICAgICAgICAgbmFtZTogdG9rZW5TdGFja1twYXJlbnRUb2tlbklkeF0ubmFtZVxuICAgICAgICAgICAgICByb3c6IHJvd1xuICAgICAgICAgICAgICBwYXJlbnRUb2tlbklkeDogcGFyZW50VG9rZW5JZHggICAgICAgICAgICAjIHB0ciB0byA8dGFnXG4gICAgICAgICAgICBpZiBwYXJlbnRUb2tlbklkeCA+PSAwIHRoZW4gdG9rZW5TdGFja1twYXJlbnRUb2tlbklkeF0udGVybXNUaGlzVGFnc0F0dHJpYnV0ZXNJZHggPSBpZHhPZlRva2VuXG4gICAgICAgICAgICBpZHhPZlRva2VuKytcblxuICAgICAgICAgICMgZW1iZWRlZCBleHByZXNzaW9uIHN0YXJ0IHtcbiAgICAgICAgICB3aGVuIEpTWEJSQUNFX09QRU5cbiAgICAgICAgICAgIHRva2VuT25UaGlzTGluZSA9IHRydWVcbiAgICAgICAgICAgIGlmIGlzRmlyc3RUb2tlbk9mTGluZVxuICAgICAgICAgICAgICBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnB1c2ggcGFyZW50VG9rZW5JZHggPSBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnBvcCgpXG4gICAgICAgICAgICAgIGlmIHBhcmVudFRva2VuSWR4P1xuICAgICAgICAgICAgICAgIGlmIHRva2VuU3RhY2tbcGFyZW50VG9rZW5JZHhdLnR5cGUgaXMgSlNYVEFHX09QRU4gYW5kIHRva2VuU3RhY2tbcGFyZW50VG9rZW5JZHhdLnRlcm1zVGhpc1RhZ3NBdHRyaWJ1dGVzSWR4IGlzIG51bGxcbiAgICAgICAgICAgICAgICAgIGluZGVudFJlY2FsYyA9IEBpbmRlbnRSb3coe3Jvdzogcm93LCBibG9ja0luZGVudDogdG9rZW5TdGFja1twYXJlbnRUb2tlbklkeF0uZmlyc3RDaGFySW5kZW50YXRpb24sIGpzeEluZGVudFByb3BzOiAxfSlcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBpbmRlbnRSZWNhbGMgPSBAaW5kZW50Um93KHtyb3c6IHJvdywgYmxvY2tJbmRlbnQ6IHRva2VuU3RhY2tbcGFyZW50VG9rZW5JZHhdLmZpcnN0Q2hhckluZGVudGF0aW9uLCBqc3hJbmRlbnQ6IDF9IClcblxuICAgICAgICAgICAgIyByZS1wYXJzZSBsaW5lIGlmIGluZGVudCBkaWQgc29tZXRoaW5nIHRvIGl0XG4gICAgICAgICAgICBpZiBpbmRlbnRSZWNhbGNcbiAgICAgICAgICAgICAgbGluZSA9IEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cgcm93XG4gICAgICAgICAgICAgIEBKU1hSRUdFWFAubGFzdEluZGV4ID0gMCAjZm9yY2UgcmVnZXggdG8gc3RhcnQgYWdhaW5cbiAgICAgICAgICAgICAgY29udGludWVcblxuICAgICAgICAgICAgaXNGaXJzdFRhZ09mQmxvY2sgPSB0cnVlICAjIHRoaXMgbWF5IGJlIHRoZSBzdGFydCBvZiBhIG5ldyBKU1ggYmxvY2tcbiAgICAgICAgICAgIGlzRmlyc3RUb2tlbk9mTGluZSA9IGZhbHNlXG5cbiAgICAgICAgICAgIHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucHVzaCBwYXJlbnRUb2tlbklkeCA9IHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcbiAgICAgICAgICAgIHRva2VuU3RhY2sucHVzaFxuICAgICAgICAgICAgICB0eXBlOiB0b2tlblxuICAgICAgICAgICAgICBuYW1lOiAnJ1xuICAgICAgICAgICAgICByb3c6IHJvd1xuICAgICAgICAgICAgICBmaXJzdFRhZ0luTGluZUluZGVudGF0aW9uOiBmaXJzdFRhZ0luTGluZUluZGVudGF0aW9uXG4gICAgICAgICAgICAgIHRva2VuSW5kZW50YXRpb246IHRva2VuSW5kZW50YXRpb25cbiAgICAgICAgICAgICAgZmlyc3RDaGFySW5kZW50YXRpb246IGZpcnN0Q2hhckluZGVudGF0aW9uXG4gICAgICAgICAgICAgIHBhcmVudFRva2VuSWR4OiBwYXJlbnRUb2tlbklkeFxuICAgICAgICAgICAgICB0ZXJtc1RoaXNUYWdzQXR0cmlidXRlc0lkeDogbnVsbCAgIyBwdHIgdG8gPiB0YWdcbiAgICAgICAgICAgICAgdGVybXNUaGlzVGFnSWR4OiBudWxsICAgICAgICAgICAgICMgcHRyIHRvIDwvdGFnPlxuXG4gICAgICAgICAgICBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnB1c2ggaWR4T2ZUb2tlblxuICAgICAgICAgICAgaWR4T2ZUb2tlbisrXG5cbiAgICAgICAgICAjIHRlcm5hcnkgc3RhcnRcbiAgICAgICAgICB3aGVuIFRFUk5BUllfSUZcbiAgICAgICAgICAgIHRva2VuT25UaGlzTGluZSA9IHRydWVcbiAgICAgICAgICAgIGlmIGlzRmlyc3RUb2tlbk9mTGluZVxuICAgICAgICAgICAgICAjIGlzIHRoaXMgdGVybmFyeSBzdGFydGluZyBhIG5ldyBsaW5lXG4gICAgICAgICAgICAgIGlmIGZpcnN0Q2hhckluZGVudGF0aW9uIGlzIHRva2VuSW5kZW50YXRpb25cbiAgICAgICAgICAgICAgICBpbmRlbnRSZWNhbGMgPSBAaW5kZW50Um93KHtyb3c6IHJvdywgYmxvY2tJbmRlbnQ6IEBnZXRJbmRlbnRPZlByZXZpb3VzUm93KHJvdyksIGpzeEluZGVudDogMX0pXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnB1c2ggcGFyZW50VG9rZW5JZHggPSBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnBvcCgpXG4gICAgICAgICAgICAgICAgaWYgcGFyZW50VG9rZW5JZHg/XG4gICAgICAgICAgICAgICAgICBpZiB0b2tlblN0YWNrW3BhcmVudFRva2VuSWR4XS50eXBlIGlzIEpTWFRBR19PUEVOIGFuZCB0b2tlblN0YWNrW3BhcmVudFRva2VuSWR4XS50ZXJtc1RoaXNUYWdzQXR0cmlidXRlc0lkeCBpcyBudWxsXG4gICAgICAgICAgICAgICAgICAgIGluZGVudFJlY2FsYyA9IEBpbmRlbnRSb3coe3Jvdzogcm93LCBibG9ja0luZGVudDogdG9rZW5TdGFja1twYXJlbnRUb2tlbklkeF0uZmlyc3RDaGFySW5kZW50YXRpb24sIGpzeEluZGVudFByb3BzOiAxfSlcbiAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50UmVjYWxjID0gQGluZGVudFJvdyh7cm93OiByb3csIGJsb2NrSW5kZW50OiB0b2tlblN0YWNrW3BhcmVudFRva2VuSWR4XS5maXJzdENoYXJJbmRlbnRhdGlvbiwganN4SW5kZW50OiAxfSApXG5cblxuICAgICAgICAgICAgIyByZS1wYXJzZSBsaW5lIGlmIGluZGVudCBkaWQgc29tZXRoaW5nIHRvIGl0XG4gICAgICAgICAgICBpZiBpbmRlbnRSZWNhbGNcbiAgICAgICAgICAgICAgbGluZSA9IEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cgcm93XG4gICAgICAgICAgICAgIEBKU1hSRUdFWFAubGFzdEluZGV4ID0gMCAjZm9yY2UgcmVnZXggdG8gc3RhcnQgYWdhaW5cbiAgICAgICAgICAgICAgY29udGludWVcblxuICAgICAgICAgICAgaXNGaXJzdFRhZ09mQmxvY2sgPSB0cnVlICAjIHRoaXMgbWF5IGJlIHRoZSBzdGFydCBvZiBhIG5ldyBKU1ggYmxvY2tcbiAgICAgICAgICAgIGlzRmlyc3RUb2tlbk9mTGluZSA9IGZhbHNlXG5cbiAgICAgICAgICAgIHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucHVzaCBwYXJlbnRUb2tlbklkeCA9IHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcbiAgICAgICAgICAgIHRva2VuU3RhY2sucHVzaFxuICAgICAgICAgICAgICB0eXBlOiB0b2tlblxuICAgICAgICAgICAgICBuYW1lOiAnJ1xuICAgICAgICAgICAgICByb3c6IHJvd1xuICAgICAgICAgICAgICBmaXJzdFRhZ0luTGluZUluZGVudGF0aW9uOiBmaXJzdFRhZ0luTGluZUluZGVudGF0aW9uXG4gICAgICAgICAgICAgIHRva2VuSW5kZW50YXRpb246IHRva2VuSW5kZW50YXRpb25cbiAgICAgICAgICAgICAgZmlyc3RDaGFySW5kZW50YXRpb246IGZpcnN0Q2hhckluZGVudGF0aW9uXG4gICAgICAgICAgICAgIHBhcmVudFRva2VuSWR4OiBwYXJlbnRUb2tlbklkeFxuICAgICAgICAgICAgICB0ZXJtc1RoaXNUYWdzQXR0cmlidXRlc0lkeDogbnVsbCAgIyBwdHIgdG8gPiB0YWdcbiAgICAgICAgICAgICAgdGVybXNUaGlzVGFnSWR4OiBudWxsICAgICAgICAgICAgICMgcHRyIHRvIDwvdGFnPlxuXG4gICAgICAgICAgICBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnB1c2ggaWR4T2ZUb2tlblxuICAgICAgICAgICAgaWR4T2ZUb2tlbisrXG5cbiAgICAgICAgICAjIGVtYmVkZWQgZXhwcmVzc2lvbiBlbmQgfVxuICAgICAgICAgIHdoZW4gSlNYQlJBQ0VfQ0xPU0UsIFRFUk5BUllfRUxTRVxuICAgICAgICAgICAgdG9rZW5PblRoaXNMaW5lID0gdHJ1ZVxuXG4gICAgICAgICAgICBpZiBpc0ZpcnN0VG9rZW5PZkxpbmVcbiAgICAgICAgICAgICAgc3RhY2tPZlRva2Vuc1N0aWxsT3Blbi5wdXNoIHBhcmVudFRva2VuSWR4ID0gc3RhY2tPZlRva2Vuc1N0aWxsT3Blbi5wb3AoKVxuICAgICAgICAgICAgICBpbmRlbnRSZWNhbGMgPSBAaW5kZW50Um93KHtyb3c6IHJvdywgYmxvY2tJbmRlbnQ6IHRva2VuU3RhY2tbcGFyZW50VG9rZW5JZHhdLmZpcnN0Q2hhckluZGVudGF0aW9uIH0pXG5cbiAgICAgICAgICAgIGlmIGluZGVudFJlY2FsY1xuICAgICAgICAgICAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyByb3dcbiAgICAgICAgICAgICAgQEpTWFJFR0VYUC5sYXN0SW5kZXggPSAwICNmb3JjZSByZWdleCB0byBzdGFydCBhZ2FpblxuICAgICAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgICAgICBpc0ZpcnN0VGFnT2ZCbG9jayA9IGZhbHNlXG4gICAgICAgICAgICBpc0ZpcnN0VG9rZW5PZkxpbmUgPSBmYWxzZVxuXG4gICAgICAgICAgICBwYXJlbnRUb2tlbklkeCA9IHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcbiAgICAgICAgICAgIHRva2VuU3RhY2sucHVzaFxuICAgICAgICAgICAgICB0eXBlOiB0b2tlblxuICAgICAgICAgICAgICBuYW1lOiAnJ1xuICAgICAgICAgICAgICByb3c6IHJvd1xuICAgICAgICAgICAgICBwYXJlbnRUb2tlbklkeDogcGFyZW50VG9rZW5JZHggICAgICAgICAjIHB0ciB0byBvcGVuaW5nIHRva2VuXG5cbiAgICAgICAgICAgIGlmIHBhcmVudFRva2VuSWR4ID49MCB0aGVuIHRva2VuU3RhY2tbcGFyZW50VG9rZW5JZHhdLnRlcm1zVGhpc1RhZ0lkeCA9IGlkeE9mVG9rZW5cbiAgICAgICAgICAgIGlkeE9mVG9rZW4rK1xuXG4gICAgICAgICAgIyBKYXZhc2NyaXB0IGJyYWNlIFN0YXJ0IHsgb3Igc3dpdGNoIGJyYWNlIHN0YXJ0IHsgb3IgcGFyZW4gKCBvciBiYWNrLXRpY2sgYHN0YXJ0XG4gICAgICAgICAgd2hlbiBCUkFDRV9PUEVOLCBTV0lUQ0hfQlJBQ0VfT1BFTiwgUEFSRU5fT1BFTiwgVEVNUExBVEVfU1RBUlRcbiAgICAgICAgICAgIHRva2VuT25UaGlzTGluZSA9IHRydWVcbiAgICAgICAgICAgIGlmIHRva2VuIGlzIFRFTVBMQVRFX1NUQVJUIHRoZW4gQHRlbXBsYXRlRGVwdGgrK1xuICAgICAgICAgICAgaWYgaXNGaXJzdFRva2VuT2ZMaW5lXG4gICAgICAgICAgICAgIHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucHVzaCBwYXJlbnRUb2tlbklkeCA9IHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcbiAgICAgICAgICAgICAgaWYgaXNGaXJzdFRhZ09mQmxvY2sgYW5kXG4gICAgICAgICAgICAgICAgICBwYXJlbnRUb2tlbklkeD8gYW5kXG4gICAgICAgICAgICAgICAgICB0b2tlblN0YWNrW3BhcmVudFRva2VuSWR4XS50eXBlIGlzIHRva2VuIGFuZFxuICAgICAgICAgICAgICAgICAgdG9rZW5TdGFja1twYXJlbnRUb2tlbklkeF0ucm93IGlzICggcm93IC0gMSlcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5JbmRlbnRhdGlvbiA9IGZpcnN0Q2hhckluZGVudGF0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgICBAZXNsaW50SW5kZW50T3B0aW9ucy5qc3hJbmRlbnRbMV0gKyBAZ2V0SW5kZW50T2ZQcmV2aW91c1JvdyByb3dcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50UmVjYWxjID0gQGluZGVudFJvdyh7cm93OiByb3csIGJsb2NrSW5kZW50OiBmaXJzdENoYXJJbmRlbnRhdGlvbn0pXG4gICAgICAgICAgICAgIGVsc2UgaWYgcGFyZW50VG9rZW5JZHg/IGFuZCBAdGVybmFyeVRlcm1pbmF0ZXNQcmV2aW91c0xpbmUocm93KVxuICAgICAgICAgICAgICAgIGZpcnN0VGFnSW5MaW5lSW5kZW50YXRpb24gPSAgdG9rZW5JbmRlbnRhdGlvblxuICAgICAgICAgICAgICAgIGZpcnN0Q2hhckluZGVudGF0aW9uID0gQGdldEluZGVudE9mUHJldmlvdXNSb3cocm93KVxuICAgICAgICAgICAgICAgIGluZGVudFJlY2FsYyA9IEBpbmRlbnRSb3coe3Jvdzogcm93ICwgYmxvY2tJbmRlbnQ6IGZpcnN0Q2hhckluZGVudGF0aW9uIH0pXG4gICAgICAgICAgICAgIGVsc2UgaWYgcGFyZW50VG9rZW5JZHg/XG4gICAgICAgICAgICAgICAgaW5kZW50UmVjYWxjID0gQGluZGVudFJvdyh7cm93OiByb3csIGJsb2NrSW5kZW50OiB0b2tlblN0YWNrW3BhcmVudFRva2VuSWR4XS5maXJzdENoYXJJbmRlbnRhdGlvbiwganN4SW5kZW50OiAxIH0gKVxuXG4gICAgICAgICAgICAjIHJlLXBhcnNlIGxpbmUgaWYgaW5kZW50IGRpZCBzb21ldGhpbmcgdG8gaXRcbiAgICAgICAgICAgIGlmIGluZGVudFJlY2FsY1xuICAgICAgICAgICAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyByb3dcbiAgICAgICAgICAgICAgQEpTWFJFR0VYUC5sYXN0SW5kZXggPSAwICNmb3JjZSByZWdleCB0byBzdGFydCBhZ2FpblxuICAgICAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgICAgICBpc0ZpcnN0VG9rZW5PZkxpbmUgPSBmYWxzZVxuXG4gICAgICAgICAgICBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnB1c2ggcGFyZW50VG9rZW5JZHggPSBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnBvcCgpXG4gICAgICAgICAgICB0b2tlblN0YWNrLnB1c2hcbiAgICAgICAgICAgICAgdHlwZTogdG9rZW5cbiAgICAgICAgICAgICAgbmFtZTogJydcbiAgICAgICAgICAgICAgcm93OiByb3dcbiAgICAgICAgICAgICAgZmlyc3RUYWdJbkxpbmVJbmRlbnRhdGlvbjogZmlyc3RUYWdJbkxpbmVJbmRlbnRhdGlvblxuICAgICAgICAgICAgICB0b2tlbkluZGVudGF0aW9uOiB0b2tlbkluZGVudGF0aW9uXG4gICAgICAgICAgICAgIGZpcnN0Q2hhckluZGVudGF0aW9uOiBmaXJzdENoYXJJbmRlbnRhdGlvblxuICAgICAgICAgICAgICBwYXJlbnRUb2tlbklkeDogcGFyZW50VG9rZW5JZHhcbiAgICAgICAgICAgICAgdGVybXNUaGlzVGFnc0F0dHJpYnV0ZXNJZHg6IG51bGwgICMgcHRyIHRvID4gdGFnXG4gICAgICAgICAgICAgIHRlcm1zVGhpc1RhZ0lkeDogbnVsbCAgICAgICAgICAgICAjIHB0ciB0byA8L3RhZz5cblxuICAgICAgICAgICAgc3RhY2tPZlRva2Vuc1N0aWxsT3Blbi5wdXNoIGlkeE9mVG9rZW5cbiAgICAgICAgICAgIGlkeE9mVG9rZW4rK1xuXG4gICAgICAgICAgIyBKYXZhc2NyaXB0IGJyYWNlIEVuZCB9IG9yIHN3aXRjaCBicmFjZSBlbmQgfSBvciBwYXJlbiBjbG9zZSApIG9yIGJhY2stdGljayBgIGVuZFxuICAgICAgICAgIHdoZW4gQlJBQ0VfQ0xPU0UsIFNXSVRDSF9CUkFDRV9DTE9TRSwgUEFSRU5fQ0xPU0UsIFRFTVBMQVRFX0VORFxuXG4gICAgICAgICAgICBpZiB0b2tlbiBpcyBTV0lUQ0hfQlJBQ0VfQ0xPU0VcbiAgICAgICAgICAgICAgc3RhY2tPZlRva2Vuc1N0aWxsT3Blbi5wdXNoIHBhcmVudFRva2VuSWR4ID0gc3RhY2tPZlRva2Vuc1N0aWxsT3Blbi5wb3AoKVxuICAgICAgICAgICAgICBpZiB0b2tlblN0YWNrW3BhcmVudFRva2VuSWR4XS50eXBlIGlzIFNXSVRDSF9DQVNFIG9yIHRva2VuU3RhY2tbcGFyZW50VG9rZW5JZHhdLnR5cGUgaXMgU1dJVENIX0RFRkFVTFRcbiAgICAgICAgICAgICAgICAjIHdlIG9ubHkgYWxsb3cgYSBzaW5nbGUgY2FzZS9kZWZhdWx0IHN0YWNrIGVsZW1lbnQgcGVyIHN3aXRjaCBpbnN0YW5jZVxuICAgICAgICAgICAgICAgICMgc28gbm93IHdlIGFyZSBhdCB0aGUgc3dpdGNoJ3MgY2xvc2UgYnJhY2Ugd2UgcG9wIG9mZiBhbnkgY2FzZS9kZWZhdWx0IHRva2Vuc1xuICAgICAgICAgICAgICAgIHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcblxuICAgICAgICAgICAgdG9rZW5PblRoaXNMaW5lID0gdHJ1ZVxuICAgICAgICAgICAgaWYgaXNGaXJzdFRva2VuT2ZMaW5lXG4gICAgICAgICAgICAgIHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucHVzaCBwYXJlbnRUb2tlbklkeCA9IHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcbiAgICAgICAgICAgICAgaWYgcGFyZW50VG9rZW5JZHg/XG4gICAgICAgICAgICAgICAgaW5kZW50UmVjYWxjID0gQGluZGVudFJvdyh7cm93OiByb3csIGJsb2NrSW5kZW50OiB0b2tlblN0YWNrW3BhcmVudFRva2VuSWR4XS5maXJzdENoYXJJbmRlbnRhdGlvbiB9KVxuXG4gICAgICAgICAgICAjIHJlLXBhcnNlIGxpbmUgaWYgaW5kZW50IGRpZCBzb21ldGhpbmcgdG8gaXRcbiAgICAgICAgICAgIGlmIGluZGVudFJlY2FsY1xuICAgICAgICAgICAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyByb3dcbiAgICAgICAgICAgICAgQEpTWFJFR0VYUC5sYXN0SW5kZXggPSAwICNmb3JjZSByZWdleCB0byBzdGFydCBhZ2FpblxuICAgICAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgICAgICBpc0ZpcnN0VG9rZW5PZkxpbmUgPSBmYWxzZVxuXG4gICAgICAgICAgICBwYXJlbnRUb2tlbklkeCA9IHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcbiAgICAgICAgICAgIGlmIHBhcmVudFRva2VuSWR4P1xuICAgICAgICAgICAgICB0b2tlblN0YWNrLnB1c2hcbiAgICAgICAgICAgICAgICB0eXBlOiB0b2tlblxuICAgICAgICAgICAgICAgIG5hbWU6ICcnXG4gICAgICAgICAgICAgICAgcm93OiByb3dcbiAgICAgICAgICAgICAgICBwYXJlbnRUb2tlbklkeDogcGFyZW50VG9rZW5JZHggICAgICAgICAjIHB0ciB0byA8dGFnXG4gICAgICAgICAgICAgIGlmIHBhcmVudFRva2VuSWR4ID49MCB0aGVuIHRva2VuU3RhY2tbcGFyZW50VG9rZW5JZHhdLnRlcm1zVGhpc1RhZ0lkeCA9IGlkeE9mVG9rZW5cbiAgICAgICAgICAgICAgaWR4T2ZUb2tlbisrXG5cbiAgICAgICAgICAgIGlmIHRva2VuIGlzIFRFTVBMQVRFX0VORCB0aGVuIEB0ZW1wbGF0ZURlcHRoLS1cblxuICAgICAgICAgICMgY2FzZSwgZGVmYXVsdCBzdGF0ZW1lbnQgb2Ygc3dpdGNoXG4gICAgICAgICAgd2hlbiBTV0lUQ0hfQ0FTRSwgU1dJVENIX0RFRkFVTFRcbiAgICAgICAgICAgIHRva2VuT25UaGlzTGluZSA9IHRydWVcbiAgICAgICAgICAgIGlzRmlyc3RUYWdPZkJsb2NrID0gdHJ1ZVxuICAgICAgICAgICAgaWYgaXNGaXJzdFRva2VuT2ZMaW5lXG4gICAgICAgICAgICAgIHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucHVzaCBwYXJlbnRUb2tlbklkeCA9IHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcbiAgICAgICAgICAgICAgaWYgcGFyZW50VG9rZW5JZHg/XG4gICAgICAgICAgICAgICAgaWYgdG9rZW5TdGFja1twYXJlbnRUb2tlbklkeF0udHlwZSBpcyBTV0lUQ0hfQ0FTRSBvciB0b2tlblN0YWNrW3BhcmVudFRva2VuSWR4XS50eXBlIGlzIFNXSVRDSF9ERUZBVUxUXG4gICAgICAgICAgICAgICAgICAjIHdlIG9ubHkgYWxsb3cgYSBzaW5nbGUgY2FzZS9kZWZhdWx0IHN0YWNrIGVsZW1lbnQgcGVyIHN3aXRjaCBpbnN0YW5jZVxuICAgICAgICAgICAgICAgICAgIyBzbyBwb3NpdGlvbiBuZXcgY2FzZS9kZWZhdWx0IHRvIHRoZSBsYXN0IG9uZXMgcG9zaXRpb24gYW5kIHRoZW4gcG9wIHRoZSBsYXN0J3NcbiAgICAgICAgICAgICAgICAgICMgb2ZmIHRoZSBzdGFjay5cbiAgICAgICAgICAgICAgICAgIGluZGVudFJlY2FsYyA9IEBpbmRlbnRSb3coe3Jvdzogcm93LCBibG9ja0luZGVudDogdG9rZW5TdGFja1twYXJlbnRUb2tlbklkeF0uZmlyc3RDaGFySW5kZW50YXRpb24gfSlcbiAgICAgICAgICAgICAgICAgIHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW4ucG9wKClcbiAgICAgICAgICAgICAgICBlbHNlIGlmIHRva2VuU3RhY2tbcGFyZW50VG9rZW5JZHhdLnR5cGUgaXMgU1dJVENIX0JSQUNFX09QRU5cbiAgICAgICAgICAgICAgICAgIGluZGVudFJlY2FsYyA9IEBpbmRlbnRSb3coe3Jvdzogcm93LCBibG9ja0luZGVudDogdG9rZW5TdGFja1twYXJlbnRUb2tlbklkeF0uZmlyc3RDaGFySW5kZW50YXRpb24sIGpzeEluZGVudDogMSB9KVxuXG4gICAgICAgICAgICAjIHJlLXBhcnNlIGxpbmUgaWYgaW5kZW50IGRpZCBzb21ldGhpbmcgdG8gaXRcbiAgICAgICAgICAgIGlmIGluZGVudFJlY2FsY1xuICAgICAgICAgICAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyByb3dcbiAgICAgICAgICAgICAgQEpTWFJFR0VYUC5sYXN0SW5kZXggPSAwICNmb3JjZSByZWdleCB0byBzdGFydCBhZ2FpblxuICAgICAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgICAgICBpc0ZpcnN0VG9rZW5PZkxpbmUgPSBmYWxzZVxuXG4gICAgICAgICAgICBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnB1c2ggcGFyZW50VG9rZW5JZHggPSBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnBvcCgpXG5cbiAgICAgICAgICAgIHRva2VuU3RhY2sucHVzaFxuICAgICAgICAgICAgICB0eXBlOiB0b2tlblxuICAgICAgICAgICAgICBuYW1lOiAnJ1xuICAgICAgICAgICAgICByb3c6IHJvd1xuICAgICAgICAgICAgICBmaXJzdFRhZ0luTGluZUluZGVudGF0aW9uOiBmaXJzdFRhZ0luTGluZUluZGVudGF0aW9uXG4gICAgICAgICAgICAgIHRva2VuSW5kZW50YXRpb246IHRva2VuSW5kZW50YXRpb25cbiAgICAgICAgICAgICAgZmlyc3RDaGFySW5kZW50YXRpb246IGZpcnN0Q2hhckluZGVudGF0aW9uXG4gICAgICAgICAgICAgIHBhcmVudFRva2VuSWR4OiBwYXJlbnRUb2tlbklkeFxuICAgICAgICAgICAgICB0ZXJtc1RoaXNUYWdzQXR0cmlidXRlc0lkeDogbnVsbCAgIyBwdHIgdG8gPiB0YWdcbiAgICAgICAgICAgICAgdGVybXNUaGlzVGFnSWR4OiBudWxsICAgICAgICAgICAgICMgcHRyIHRvIDwvdGFnPlxuXG4gICAgICAgICAgICBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnB1c2ggaWR4T2ZUb2tlblxuICAgICAgICAgICAgaWR4T2ZUb2tlbisrXG5cbiAgICAgICAgICAjIFRlcm5hcnkgYW5kIGNvbmRpdGlvbmFsIGlmL2Vsc2Ugb3BlcmF0b3JzXG4gICAgICAgICAgd2hlbiBKU19JRiwgSlNfRUxTRSwgSlNfUkVUVVJOXG4gICAgICAgICAgICBpc0ZpcnN0VGFnT2ZCbG9jayA9IHRydWVcblxuICAgICAgIyBoYW5kbGUgbGluZXMgd2l0aCBubyB0b2tlbiBvbiB0aGVtXG4gICAgICBpZiBpZHhPZlRva2VuIGFuZCBub3QgdG9rZW5PblRoaXNMaW5lXG4gICAgICAgICMgaW5kZW50IGxpbmVzIGJ1dCByZW1vdmUgYW55IGJsYW5rIGxpbmVzIHdpdGggd2hpdGUgc3BhY2UgZXhjZXB0IHRoZSBsYXN0IHJvd1xuICAgICAgICBpZiByb3cgaXNudCByYW5nZS5lbmQucm93XG4gICAgICAgICAgYmxhbmtMaW5lRW5kUG9zID0gL15cXHMqJC8uZXhlYyhAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJvdykpP1swXS5sZW5ndGhcbiAgICAgICAgICBpZiBibGFua0xpbmVFbmRQb3M/XG4gICAgICAgICAgICBAaW5kZW50Um93KHtyb3c6IHJvdyAsIGJsb2NrSW5kZW50OiAwIH0pXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGluZGVudFVudG9rZW5pc2VkTGluZSByb3csIHRva2VuU3RhY2ssIHN0YWNrT2ZUb2tlbnNTdGlsbE9wZW5cbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBpbmRlbnRVbnRva2VuaXNlZExpbmUgcm93LCB0b2tlblN0YWNrLCBzdGFja09mVG9rZW5zU3RpbGxPcGVuXG5cblxuICAjIGluZGVudCBhbnkgbGluZXMgdGhhdCBoYXZlbid0IGFueSBpbnRlcmVzdGluZyB0b2tlbnNcbiAgaW5kZW50VW50b2tlbmlzZWRMaW5lOiAocm93LCB0b2tlblN0YWNrLCBzdGFja09mVG9rZW5zU3RpbGxPcGVuICkgLT5cbiAgICBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnB1c2ggcGFyZW50VG9rZW5JZHggPSBzdGFja09mVG9rZW5zU3RpbGxPcGVuLnBvcCgpXG4gICAgcmV0dXJuIGlmIG5vdCBwYXJlbnRUb2tlbklkeD9cbiAgICB0b2tlbiA9IHRva2VuU3RhY2tbcGFyZW50VG9rZW5JZHhdXG4gICAgc3dpdGNoIHRva2VuLnR5cGVcbiAgICAgIHdoZW4gSlNYVEFHX09QRU4sIEpTWFRBR19TRUxGQ0xPU0VfU1RBUlRcbiAgICAgICAgaWYgIHRva2VuLnRlcm1zVGhpc1RhZ3NBdHRyaWJ1dGVzSWR4IGlzIG51bGxcbiAgICAgICAgICBAaW5kZW50Um93KHtyb3c6IHJvdywgYmxvY2tJbmRlbnQ6IHRva2VuLmZpcnN0Q2hhckluZGVudGF0aW9uLCBqc3hJbmRlbnRQcm9wczogMSB9KVxuICAgICAgICBlbHNlIEBpbmRlbnRSb3coe3Jvdzogcm93LCBibG9ja0luZGVudDogdG9rZW4uZmlyc3RDaGFySW5kZW50YXRpb24sIGpzeEluZGVudDogMSB9KVxuICAgICAgd2hlbiBKU1hCUkFDRV9PUEVOLCBURVJOQVJZX0lGXG4gICAgICAgIEBpbmRlbnRSb3coe3Jvdzogcm93LCBibG9ja0luZGVudDogdG9rZW4uZmlyc3RDaGFySW5kZW50YXRpb24sIGpzeEluZGVudDogMSwgYWxsb3dBZGRpdGlvbmFsSW5kZW50czogdHJ1ZX0pXG4gICAgICB3aGVuIEJSQUNFX09QRU4sIFNXSVRDSF9CUkFDRV9PUEVOLCBQQVJFTl9PUEVOXG4gICAgICAgIEBpbmRlbnRSb3coe3Jvdzogcm93LCBibG9ja0luZGVudDogdG9rZW4uZmlyc3RDaGFySW5kZW50YXRpb24sIGpzeEluZGVudDogMSwgYWxsb3dBZGRpdGlvbmFsSW5kZW50czogdHJ1ZX0pXG4gICAgICB3aGVuIEpTWFRBR19TRUxGQ0xPU0VfRU5ELCBKU1hCUkFDRV9DTE9TRSwgSlNYVEFHX0NMT1NFX0FUVFJTLCBURVJOQVJZX0VMU0VcbiAgICAgICAgQGluZGVudFJvdyh7cm93OiByb3csIGJsb2NrSW5kZW50OiB0b2tlblN0YWNrW3Rva2VuLnBhcmVudFRva2VuSWR4XS5maXJzdENoYXJJbmRlbnRhdGlvbiwganN4SW5kZW50UHJvcHM6IDF9KVxuICAgICAgd2hlbiBCUkFDRV9DTE9TRSwgU1dJVENIX0JSQUNFX0NMT1NFLCBQQVJFTl9DTE9TRVxuICAgICAgICBAaW5kZW50Um93KHtyb3c6IHJvdywgYmxvY2tJbmRlbnQ6IHRva2VuU3RhY2tbdG9rZW4ucGFyZW50VG9rZW5JZHhdLmZpcnN0Q2hhckluZGVudGF0aW9uLCBqc3hJbmRlbnQ6IDEsIGFsbG93QWRkaXRpb25hbEluZGVudHM6IHRydWV9KVxuICAgICAgd2hlbiBTV0lUQ0hfQ0FTRSwgU1dJVENIX0RFRkFVTFRcbiAgICAgICAgQGluZGVudFJvdyh7cm93OiByb3csIGJsb2NrSW5kZW50OiB0b2tlbi5maXJzdENoYXJJbmRlbnRhdGlvbiwganN4SW5kZW50OiAxIH0pXG4gICAgICB3aGVuIFRFTVBMQVRFX1NUQVJULCBURU1QTEFURV9FTkRcbiAgICAgICAgcmV0dXJuOyAjIGRvbid0IHRvdWNoIHRlbXBsYXRlc1xuXG4gICMgZ2V0IHRoZSB0b2tlbiBhdCB0aGUgZ2l2ZW4gbWF0Y2ggcG9zaXRpb24gb3IgcmV0dXJuIHRydXRoeSBmYWxzZVxuICBnZXRUb2tlbjogKGJ1ZmZlclJvdywgbWF0Y2gpIC0+XG4gICAgc2NvcGUgPSBAZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFtidWZmZXJSb3csIG1hdGNoLmluZGV4XSkuZ2V0U2NvcGVzQXJyYXkoKS5wb3AoKVxuICAgIGlmICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5qc3gnIGlzIHNjb3BlXG4gICAgICBpZiAgICAgIG1hdGNoWzFdPyBvciBtYXRjaFsyMF0/IHRoZW4gcmV0dXJuIEpTWFRBR19PUEVOXG4gICAgICBlbHNlIGlmIG1hdGNoWzNdPyB0aGVuIHJldHVybiBKU1hUQUdfU0VMRkNMT1NFX0VORFxuICAgIGVsc2UgaWYgJ0pTWEVuZFRhZ1N0YXJ0JyBpcyBzY29wZVxuICAgICAgaWYgbWF0Y2hbNF0/IG9yIG1hdGNoWzIyXT8gdGhlbiByZXR1cm4gSlNYVEFHX0NMT1NFXG4gICAgZWxzZSBpZiAnSlNYU3RhcnRUYWdFbmQnIGlzIHNjb3BlXG4gICAgICBpZiBtYXRjaFs3XT8gb3IgbWF0Y2hbMjFdPyB0aGVuIHJldHVybiBKU1hUQUdfQ0xPU0VfQVRUUlNcbiAgICBlbHNlIGlmIG1hdGNoWzhdP1xuICAgICAgaWYgJ3B1bmN0dWF0aW9uLnNlY3Rpb24uZW1iZWRkZWQuYmVnaW4uanN4JyBpcyBzY29wZVxuICAgICAgICByZXR1cm4gSlNYQlJBQ0VfT1BFTlxuICAgICAgZWxzZSBpZiAnbWV0YS5icmFjZS5jdXJseS5zd2l0Y2hTdGFydC5qcycgaXMgc2NvcGVcbiAgICAgICAgcmV0dXJuIFNXSVRDSF9CUkFDRV9PUEVOXG4gICAgICBlbHNlIGlmICdtZXRhLmJyYWNlLmN1cmx5LmpzJyBpcyBzY29wZSBvclxuICAgICAgICAnbWV0YS5icmFjZS5jdXJseS5saXRvYmouanMnIGlzIHNjb3BlXG4gICAgICAgICAgcmV0dXJuIEJSQUNFX09QRU5cbiAgICBlbHNlIGlmIG1hdGNoWzldP1xuICAgICAgaWYgJ3B1bmN0dWF0aW9uLnNlY3Rpb24uZW1iZWRkZWQuZW5kLmpzeCcgaXMgc2NvcGVcbiAgICAgICAgcmV0dXJuIEpTWEJSQUNFX0NMT1NFXG4gICAgICBlbHNlIGlmICdtZXRhLmJyYWNlLmN1cmx5LnN3aXRjaEVuZC5qcycgaXMgc2NvcGVcbiAgICAgICAgcmV0dXJuIFNXSVRDSF9CUkFDRV9DTE9TRVxuICAgICAgZWxzZSBpZiAnbWV0YS5icmFjZS5jdXJseS5qcycgaXMgc2NvcGUgb3JcbiAgICAgICAgJ21ldGEuYnJhY2UuY3VybHkubGl0b2JqLmpzJyBpcyBzY29wZVxuICAgICAgICAgIHJldHVybiBCUkFDRV9DTE9TRVxuICAgIGVsc2UgaWYgbWF0Y2hbMTBdP1xuICAgICAgaWYgJ2tleXdvcmQub3BlcmF0b3IudGVybmFyeS5qcycgaXMgc2NvcGVcbiAgICAgICAgcmV0dXJuIFRFUk5BUllfSUZcbiAgICBlbHNlIGlmIG1hdGNoWzExXT9cbiAgICAgIGlmICdrZXl3b3JkLm9wZXJhdG9yLnRlcm5hcnkuanMnIGlzIHNjb3BlXG4gICAgICAgIHJldHVybiBURVJOQVJZX0VMU0VcbiAgICBlbHNlIGlmIG1hdGNoWzEyXT9cbiAgICAgIGlmICdrZXl3b3JkLmNvbnRyb2wuY29uZGl0aW9uYWwuanMnIGlzIHNjb3BlXG4gICAgICAgIHJldHVybiBKU19JRlxuICAgIGVsc2UgaWYgbWF0Y2hbMTNdP1xuICAgICAgaWYgJ2tleXdvcmQuY29udHJvbC5jb25kaXRpb25hbC5qcycgaXMgc2NvcGVcbiAgICAgICAgcmV0dXJuIEpTX0VMU0VcbiAgICBlbHNlIGlmIG1hdGNoWzE0XT9cbiAgICAgIGlmICdrZXl3b3JkLmNvbnRyb2wuc3dpdGNoLmpzJyBpcyBzY29wZVxuICAgICAgICByZXR1cm4gU1dJVENIX0NBU0VcbiAgICBlbHNlIGlmIG1hdGNoWzE1XT9cbiAgICAgIGlmICdrZXl3b3JkLmNvbnRyb2wuc3dpdGNoLmpzJyBpcyBzY29wZVxuICAgICAgICByZXR1cm4gU1dJVENIX0RFRkFVTFRcbiAgICBlbHNlIGlmIG1hdGNoWzE2XT9cbiAgICAgIGlmICdrZXl3b3JkLmNvbnRyb2wuZmxvdy5qcycgaXMgc2NvcGVcbiAgICAgICAgcmV0dXJuIEpTX1JFVFVSTlxuICAgIGVsc2UgaWYgbWF0Y2hbMTddP1xuICAgICAgaWYgJ21ldGEuYnJhY2Uucm91bmQuanMnIGlzIHNjb3BlIG9yXG4gICAgICAgJ21ldGEuYnJhY2Uucm91bmQuZ3JhcGhxbCcgaXMgc2NvcGUgb3JcbiAgICAgICAnbWV0YS5icmFjZS5yb3VuZC5kaXJlY3RpdmUuZ3JhcGhxbCcgaXMgc2NvcGVcbiAgICAgICAgICByZXR1cm4gUEFSRU5fT1BFTlxuICAgIGVsc2UgaWYgbWF0Y2hbMThdP1xuICAgICAgaWYgJ21ldGEuYnJhY2Uucm91bmQuanMnIGlzIHNjb3BlIG9yXG4gICAgICAgJ21ldGEuYnJhY2Uucm91bmQuZ3JhcGhxbCcgaXMgc2NvcGUgb3JcbiAgICAgICAnbWV0YS5icmFjZS5yb3VuZC5kaXJlY3RpdmUuZ3JhcGhxbCcgaXMgc2NvcGVcbiAgICAgICAgICByZXR1cm4gUEFSRU5fQ0xPU0VcbiAgICBlbHNlIGlmIG1hdGNoWzE5XT9cbiAgICAgIGlmICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnF1YXNpLmJlZ2luLmpzJyBpcyBzY29wZVxuICAgICAgICByZXR1cm4gVEVNUExBVEVfU1RBUlRcbiAgICAgIGlmICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnF1YXNpLmVuZC5qcycgaXMgc2NvcGVcbiAgICAgICAgcmV0dXJuIFRFTVBMQVRFX0VORFxuXG4gICAgcmV0dXJuIE5PX1RPS0VOXG5cblxuICAjIGdldCBpbmRlbnQgb2YgdGhlIHByZXZpb3VzIHJvdyB3aXRoIGNoYXJzIGluIGl0XG4gIGdldEluZGVudE9mUHJldmlvdXNSb3c6IChyb3cpIC0+XG4gICAgcmV0dXJuIDAgdW5sZXNzIHJvd1xuICAgIGZvciByb3cgaW4gW3Jvdy0xLi4uMF1cbiAgICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93IHJvd1xuICAgICAgcmV0dXJuIEBlZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3cgcm93IGlmICAvLipcXFMvLnRlc3QgbGluZVxuICAgIHJldHVybiAwXG5cbiAgIyBnZXQgZXNsaW50IHRyYW5zbGF0ZWQgaW5kZW50IG9wdGlvbnNcbiAgZ2V0SW5kZW50T3B0aW9uczogKCkgLT5cbiAgICBpZiBub3QgQGF1dG9Kc3ggdGhlbiByZXR1cm4gQHRyYW5zbGF0ZUluZGVudE9wdGlvbnMoKVxuICAgIGlmIGVzbGludHJjRmlsZW5hbWUgPSBAZ2V0RXNsaW50cmNGaWxlbmFtZSgpXG4gICAgICBlc2xpbnRyY0ZpbGVuYW1lID0gbmV3IEZpbGUoZXNsaW50cmNGaWxlbmFtZSlcbiAgICAgIEB0cmFuc2xhdGVJbmRlbnRPcHRpb25zKEByZWFkRXNsaW50cmNPcHRpb25zKGVzbGludHJjRmlsZW5hbWUuZ2V0UGF0aCgpKSlcbiAgICBlbHNlXG4gICAgICBAdHJhbnNsYXRlSW5kZW50T3B0aW9ucyh7fSkgIyBnZXQgZGVmYXVsdHNcblxuICAjIHJldHVybiB0ZXh0IHN0cmluZyBvZiBhIHByb2plY3QgYmFzZWQgLmVzbGludHJjIGZpbGUgaWYgb25lIGV4aXN0c1xuICBnZXRFc2xpbnRyY0ZpbGVuYW1lOiAoKSAtPlxuICAgIHByb2plY3RDb250YWluaW5nU291cmNlID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoIEBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgIyBJcyB0aGUgc291cmNlRmlsZSBsb2NhdGVkIGluc2lkZSBhbiBBdG9tIHByb2plY3QgZm9sZGVyP1xuICAgIGlmIHByb2plY3RDb250YWluaW5nU291cmNlWzBdP1xuICAgICAgcGF0aC5qb2luIHByb2plY3RDb250YWluaW5nU291cmNlWzBdLCAnLmVzbGludHJjJ1xuXG4gICMgbW91c2Ugc3RhdGVcbiAgb25Nb3VzZURvd246ICgpID0+XG4gICAgQG1vdXNlVXAgPSBmYWxzZVxuXG4gICMgbW91c2Ugc3RhdGVcbiAgb25Nb3VzZVVwOiAoKSA9PlxuICAgIEBtb3VzZVVwID0gdHJ1ZVxuXG4gICMgdG8gY3JlYXRlIGluZGVudHMuIFdlIGNhbiByZWFkIGFuZCByZXR1cm4gdGhlIHJ1bGVzIHByb3BlcnRpZXMgb3IgdW5kZWZpbmVkXG4gIHJlYWRFc2xpbnRyY09wdGlvbnM6IChlc2xpbnRyY0ZpbGUpIC0+XG4gICAgIyBFeHBlbnNpdmUgZGVwZW5kZW5jeTogdXNlIGEgbGF6eSByZXF1aXJlLlxuICAgIGZzID0gcmVxdWlyZSAnZnMtcGx1cydcbiAgICAjIGdldCBsb2NhbCBwYXRoIG92ZXJpZGVzXG4gICAgaWYgZnMuaXNGaWxlU3luYyBlc2xpbnRyY0ZpbGVcbiAgICAgIGZpbGVDb250ZW50ID0gc3RyaXBKc29uQ29tbWVudHMoZnMucmVhZEZpbGVTeW5jKGVzbGludHJjRmlsZSwgJ3V0ZjgnKSlcbiAgICAgIHRyeVxuICAgICAgICAjIEV4cGVuc2l2ZSBkZXBlbmRlbmN5OiB1c2UgYSBsYXp5IHJlcXVpcmUuXG4gICAgICAgIFlBTUwgPSByZXF1aXJlICdqcy15YW1sJ1xuICAgICAgICBlc2xpbnRSdWxlcyA9IChZQU1MLnNhZmVMb2FkIGZpbGVDb250ZW50KS5ydWxlc1xuICAgICAgICBpZiBlc2xpbnRSdWxlcyB0aGVuIHJldHVybiBlc2xpbnRSdWxlc1xuICAgICAgY2F0Y2ggZXJyXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIkxCOiBFcnJvciByZWFkaW5nIC5lc2xpbnRyYyBhdCAje2VzbGludHJjRmlsZX1cIixcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIGRldGFpbDogXCIje2Vyci5tZXNzYWdlfVwiXG4gICAgcmV0dXJuIHt9XG5cbiAgIyB1c2UgZXNsaW50IHJlYWN0IGZvcm1hdCBkZXNjcmliZWQgYXQgaHR0cDovL3Rpbnl1cmwuY29tL3A0bXRhdHZcbiAgIyB0dXJuIHNwYWNlcyBpbnRvIHRhYiBkaW1lbnNpb25zIHdoaWNoIGNhbiBiZSBkZWNpbWFsXG4gICMgYSBlbXB0eSBvYmplY3QgYXJndW1lbnQgcGFyc2VzIGJhY2sgdGhlIGRlZmF1bHQgc2V0dGluZ3NcbiAgdHJhbnNsYXRlSW5kZW50T3B0aW9uczogKGVzbGludFJ1bGVzKSAtPlxuICAgICMgRXNsaW50IHJ1bGVzIHRvIHVzZSBhcyBkZWZhdWx0IG92ZXJpZGRlbiBieSAuZXNsaW50cmNcbiAgICAjIE4uQi4gdGhhdCB0aGlzIGlzIG5vdCB0aGUgc2FtZSBhcyB0aGUgZXNsaW50IHJ1bGVzIGluIHRoYXRcbiAgICAjIHRoZSB0YWItc3BhY2VzIGFuZCAndGFiJ3MgaW4gZXNsaW50cmMgYXJlIGNvbnZlcnRlZCB0byB0YWJzIGJhc2VkIHVwb25cbiAgICAjIHRoZSBBdG9tIGVkaXRvciB0YWIgc3BhY2luZy5cbiAgICAjIGUuZy4gZXNsaW50IGluZGVudCBbMSw0XSB3aXRoIGFuIEF0b20gdGFiIHNwYWNpbmcgb2YgMiBiZWNvbWVzIGluZGVudCBbMSwyXVxuICAgIGVzbGludEluZGVudE9wdGlvbnMgID1cbiAgICAgIGpzeEluZGVudDogWzEsMV0gICAgICAgICAgICAjIDEgPSBlbmFibGVkLCAxPSN0YWJzXG4gICAgICBqc3hJbmRlbnRQcm9wczogWzEsMV0gICAgICAgIyAxID0gZW5hYmxlZCwgMT0jdGFic1xuICAgICAganN4Q2xvc2luZ0JyYWNrZXRMb2NhdGlvbjogW1xuICAgICAgICAxLFxuICAgICAgICBzZWxmQ2xvc2luZzogVEFHQUxJR05FRFxuICAgICAgICBub25FbXB0eTogVEFHQUxJR05FRFxuICAgICAgXVxuXG4gICAgcmV0dXJuIGVzbGludEluZGVudE9wdGlvbnMgdW5sZXNzIHR5cGVvZiBlc2xpbnRSdWxlcyBpcyBcIm9iamVjdFwiXG5cbiAgICBFU19ERUZBVUxUX0lOREVOVCA9IDQgIyBkZWZhdWx0IGVzbGludCBpbmRlbnQgYXMgc3BhY2VzXG5cbiAgICAjIHJlYWQgaW5kZW50IGlmIGl0IGV4aXN0cyBhbmQgdXNlIGl0IGFzIHRoZSBkZWZhdWx0IGluZGVudCBmb3IgSlNYXG4gICAgcnVsZSA9IGVzbGludFJ1bGVzWydpbmRlbnQnXVxuICAgIGlmIHR5cGVvZiBydWxlIGlzICdudW1iZXInIG9yIHR5cGVvZiBydWxlIGlzICdzdHJpbmcnXG4gICAgICBkZWZhdWx0SW5kZW50ICA9IEVTX0RFRkFVTFRfSU5ERU5UIC8gQGVkaXRvci5nZXRUYWJMZW5ndGgoKVxuICAgIGVsc2UgaWYgdHlwZW9mIHJ1bGUgaXMgJ29iamVjdCdcbiAgICAgIGlmIHR5cGVvZiBydWxlWzFdIGlzICdudW1iZXInXG4gICAgICAgIGRlZmF1bHRJbmRlbnQgID0gcnVsZVsxXSAvIEBlZGl0b3IuZ2V0VGFiTGVuZ3RoKClcbiAgICAgIGVsc2UgZGVmYXVsdEluZGVudCAgPSAxXG4gICAgZWxzZSBkZWZhdWx0SW5kZW50ICA9IDFcblxuICAgIHJ1bGUgPSBlc2xpbnRSdWxlc1sncmVhY3QvanN4LWluZGVudCddXG4gICAgaWYgdHlwZW9mIHJ1bGUgaXMgJ251bWJlcicgb3IgdHlwZW9mIHJ1bGUgaXMgJ3N0cmluZydcbiAgICAgIGVzbGludEluZGVudE9wdGlvbnMuanN4SW5kZW50WzBdID0gcnVsZVxuICAgICAgZXNsaW50SW5kZW50T3B0aW9ucy5qc3hJbmRlbnRbMV0gPSBFU19ERUZBVUxUX0lOREVOVCAvIEBlZGl0b3IuZ2V0VGFiTGVuZ3RoKClcbiAgICBlbHNlIGlmIHR5cGVvZiBydWxlIGlzICdvYmplY3QnXG4gICAgICBlc2xpbnRJbmRlbnRPcHRpb25zLmpzeEluZGVudFswXSA9IHJ1bGVbMF1cbiAgICAgIGlmIHR5cGVvZiBydWxlWzFdIGlzICdudW1iZXInXG4gICAgICAgIGVzbGludEluZGVudE9wdGlvbnMuanN4SW5kZW50WzFdID0gcnVsZVsxXSAvIEBlZGl0b3IuZ2V0VGFiTGVuZ3RoKClcbiAgICAgIGVsc2UgZXNsaW50SW5kZW50T3B0aW9ucy5qc3hJbmRlbnRbMV0gPSAxXG4gICAgZWxzZSBlc2xpbnRJbmRlbnRPcHRpb25zLmpzeEluZGVudFsxXSA9IGRlZmF1bHRJbmRlbnRcblxuICAgIHJ1bGUgPSBlc2xpbnRSdWxlc1sncmVhY3QvanN4LWluZGVudC1wcm9wcyddXG4gICAgaWYgdHlwZW9mIHJ1bGUgaXMgJ251bWJlcicgb3IgdHlwZW9mIHJ1bGUgaXMgJ3N0cmluZydcbiAgICAgIGVzbGludEluZGVudE9wdGlvbnMuanN4SW5kZW50UHJvcHNbMF0gPSBydWxlXG4gICAgICBlc2xpbnRJbmRlbnRPcHRpb25zLmpzeEluZGVudFByb3BzWzFdID0gRVNfREVGQVVMVF9JTkRFTlQgLyBAZWRpdG9yLmdldFRhYkxlbmd0aCgpXG4gICAgZWxzZSBpZiB0eXBlb2YgcnVsZSBpcyAnb2JqZWN0J1xuICAgICAgZXNsaW50SW5kZW50T3B0aW9ucy5qc3hJbmRlbnRQcm9wc1swXSA9IHJ1bGVbMF1cbiAgICAgIGlmIHR5cGVvZiBydWxlWzFdIGlzICdudW1iZXInXG4gICAgICAgIGVzbGludEluZGVudE9wdGlvbnMuanN4SW5kZW50UHJvcHNbMV0gPSBydWxlWzFdIC8gQGVkaXRvci5nZXRUYWJMZW5ndGgoKVxuICAgICAgZWxzZSBlc2xpbnRJbmRlbnRPcHRpb25zLmpzeEluZGVudFByb3BzWzFdID0gMVxuICAgIGVsc2UgZXNsaW50SW5kZW50T3B0aW9ucy5qc3hJbmRlbnRQcm9wc1sxXSA9IGRlZmF1bHRJbmRlbnRcblxuICAgIHJ1bGUgPSBlc2xpbnRSdWxlc1sncmVhY3QvanN4LWNsb3NpbmctYnJhY2tldC1sb2NhdGlvbiddXG4gICAgaWYgdHlwZW9mIHJ1bGUgaXMgJ251bWJlcicgb3IgdHlwZW9mIHJ1bGUgaXMgJ3N0cmluZydcbiAgICAgIGVzbGludEluZGVudE9wdGlvbnMuanN4Q2xvc2luZ0JyYWNrZXRMb2NhdGlvblswXSA9IHJ1bGVcbiAgICBlbHNlIGlmIHR5cGVvZiBydWxlIGlzICdvYmplY3QnICMgYXJyYXlcbiAgICAgIGVzbGludEluZGVudE9wdGlvbnMuanN4Q2xvc2luZ0JyYWNrZXRMb2NhdGlvblswXSA9IHJ1bGVbMF1cbiAgICAgIGlmIHR5cGVvZiBydWxlWzFdIGlzICdzdHJpbmcnXG4gICAgICAgIGVzbGludEluZGVudE9wdGlvbnMuanN4Q2xvc2luZ0JyYWNrZXRMb2NhdGlvblsxXS5zZWxmQ2xvc2luZyA9XG4gICAgICAgICAgZXNsaW50SW5kZW50T3B0aW9ucy5qc3hDbG9zaW5nQnJhY2tldExvY2F0aW9uWzFdLm5vbkVtcHR5ID1cbiAgICAgICAgICAgIHJ1bGVbMV1cbiAgICAgIGVsc2VcbiAgICAgICAgaWYgcnVsZVsxXS5zZWxmQ2xvc2luZz9cbiAgICAgICAgICBlc2xpbnRJbmRlbnRPcHRpb25zLmpzeENsb3NpbmdCcmFja2V0TG9jYXRpb25bMV0uc2VsZkNsb3NpbmcgPSBydWxlWzFdLnNlbGZDbG9zaW5nXG4gICAgICAgIGlmIHJ1bGVbMV0ubm9uRW1wdHk/XG4gICAgICAgICAgZXNsaW50SW5kZW50T3B0aW9ucy5qc3hDbG9zaW5nQnJhY2tldExvY2F0aW9uWzFdLm5vbkVtcHR5ID0gcnVsZVsxXS5ub25FbXB0eVxuXG4gICAgcmV0dXJuIGVzbGludEluZGVudE9wdGlvbnNcblxuICAjIGRvZXMgdGhlIHByZXZpb3VzIGxpbmUgdGVybWluYXRlIHdpdGggYSB0ZXJuYXJ5IGVsc2UgOlxuICB0ZXJuYXJ5VGVybWluYXRlc1ByZXZpb3VzTGluZTogKHJvdykgLT5cbiAgICByb3ctLVxuICAgIHJldHVybiBmYWxzZSB1bmxlc3Mgcm93ID49MFxuICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93IHJvd1xuICAgIG1hdGNoID0gLzpcXHMqJC8uZXhlYyhsaW5lKVxuICAgIHJldHVybiBmYWxzZSBpZiBtYXRjaCBpcyBudWxsXG4gICAgc2NvcGUgPSBAZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFtyb3csIG1hdGNoLmluZGV4XSkuZ2V0U2NvcGVzQXJyYXkoKS5wb3AoKVxuICAgIHJldHVybiBmYWxzZSBpZiBzY29wZSBpc250ICdrZXl3b3JkLm9wZXJhdG9yLnRlcm5hcnkuanMnXG4gICAgcmV0dXJuIHRydWVcblxuICAjIGFsbGlnbiBub25FbXB0eSBhbmQgc2VsZkNsb3NpbmcgdGFncyBiYXNlZCBvbiBlc2xpbnQgcnVsZXNcbiAgIyByb3cgdG8gYmUgaW5kZW50ZWQgYmFzZWQgdXBvbiBhIHBhcmVudFRhZ3MgcHJvcGVydGllcyBhbmQgYSBydWxlIHR5cGVcbiAgIyByZXR1cm5zIGluZGVudFJvdydzIHJldHVybiB2YWx1ZVxuICBpbmRlbnRGb3JDbG9zaW5nQnJhY2tldDogKCByb3csIHBhcmVudFRhZywgY2xvc2luZ0JyYWNrZXRSdWxlICkgLT5cbiAgICBpZiBAZXNsaW50SW5kZW50T3B0aW9ucy5qc3hDbG9zaW5nQnJhY2tldExvY2F0aW9uWzBdXG4gICAgICBpZiBjbG9zaW5nQnJhY2tldFJ1bGUgaXMgVEFHQUxJR05FRFxuICAgICAgICBAaW5kZW50Um93KHtyb3c6IHJvdywgYmxvY2tJbmRlbnQ6IHBhcmVudFRhZy50b2tlbkluZGVudGF0aW9ufSlcbiAgICAgIGVsc2UgaWYgY2xvc2luZ0JyYWNrZXRSdWxlIGlzIExJTkVBTElHTkVEXG4gICAgICAgIEBpbmRlbnRSb3coe3Jvdzogcm93LCBibG9ja0luZGVudDogcGFyZW50VGFnLmZpcnN0Q2hhckluZGVudGF0aW9uIH0pXG4gICAgICBlbHNlIGlmIGNsb3NpbmdCcmFja2V0UnVsZSBpcyBBRlRFUlBST1BTXG4gICAgICAgICMgdGhpcyByZWFsbHkgaXNuJ3QgdmFsaWQgYXMgdGhpcyB0YWcgc2hvdWxkbid0IGJlIG9uIGEgbGluZSBieSBpdHNlbGZcbiAgICAgICAgIyBidXQgSSBkb24ndCByZWZvcm1hdCBsaW5lcyBqdXN0IGluZGVudCFcbiAgICAgICAgIyBpbmRlbnQgdG8gbWFrZSBpdCBsb29rIE9LIGFsdGhvdWdoIGl0IHdpbGwgZmFpbCBlc2xpbnRcbiAgICAgICAgaWYgQGVzbGludEluZGVudE9wdGlvbnMuanN4SW5kZW50UHJvcHNbMF1cbiAgICAgICAgICBAaW5kZW50Um93KHtyb3c6IHJvdywgIGJsb2NrSW5kZW50OiBwYXJlbnRUYWcuZmlyc3RDaGFySW5kZW50YXRpb24sIGpzeEluZGVudFByb3BzOiAxIH0pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAaW5kZW50Um93KHtyb3c6IHJvdywgIGJsb2NrSW5kZW50OiBwYXJlbnRUYWcuZmlyc3RDaGFySW5kZW50YXRpb259KVxuICAgICAgZWxzZSBpZiBjbG9zaW5nQnJhY2tldFJ1bGUgaXMgUFJPUFNBTElHTkVEXG4gICAgICAgIGlmIEBlc2xpbnRJbmRlbnRPcHRpb25zLmpzeEluZGVudFByb3BzWzBdXG4gICAgICAgICAgQGluZGVudFJvdyh7cm93OiByb3csICBibG9ja0luZGVudDogcGFyZW50VGFnLnRva2VuSW5kZW50YXRpb24sanN4SW5kZW50UHJvcHM6IDF9KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGluZGVudFJvdyh7cm93OiByb3csICBibG9ja0luZGVudDogcGFyZW50VGFnLnRva2VuSW5kZW50YXRpb259KVxuXG4gICMgaW5kZW50IGEgcm93IGJ5IHRoZSBhZGRpdGlvbiBvZiBvbmUgb3IgbW9yZSBpbmRlbnRzLlxuICAjIHJldHVybnMgZmFsc2UgaWYgbm8gaW5kZW50IHJlcXVpcmVkIGFzIGl0IGlzIGFscmVhZHkgY29ycmVjdFxuICAjIHJldHVybiB0cnVlIGlmIGluZGVudCB3YXMgcmVxdWlyZWRcbiAgIyBibG9ja0luZGVudCBpcyB0aGUgaW5kZW50IHRvIHRoZSBzdGFydCBvZiB0aGlzIGxvZ2ljYWwganN4IGJsb2NrXG4gICMgb3RoZXIgaW5kZW50cyBhcmUgdGhlIHJlcXVpcmVkIGluZGVudCBiYXNlZCBvbiBlc2xpbnQgY29uZGl0aW9ucyBmb3IgUmVhY3RcbiAgIyBvcHRpb24gY29udGFpbnMgcm93IHRvIGluZGVudCBhbmQgYWxsb3dBZGRpdGlvbmFsSW5kZW50cyBmbGFnXG4gIGluZGVudFJvdzogKG9wdGlvbnMpIC0+XG4gICAgeyByb3csIGFsbG93QWRkaXRpb25hbEluZGVudHMsIGJsb2NrSW5kZW50LCBqc3hJbmRlbnQsIGpzeEluZGVudFByb3BzIH0gPSBvcHRpb25zXG4gICAgaWYgQHRlbXBsYXRlRGVwdGggPiAwIHRoZW4gcmV0dXJuIGZhbHNlICMgZG9uJ3QgaW5kZW50IGluc2lkZSBhIHRlbXBsYXRlXG4gICAgIyBjYWxjIG92ZXJhbGwgaW5kZW50XG4gICAgaWYganN4SW5kZW50XG4gICAgICBpZiBAZXNsaW50SW5kZW50T3B0aW9ucy5qc3hJbmRlbnRbMF1cbiAgICAgICAgaWYgQGVzbGludEluZGVudE9wdGlvbnMuanN4SW5kZW50WzFdXG4gICAgICAgICAgYmxvY2tJbmRlbnQgKz0ganN4SW5kZW50ICogQGVzbGludEluZGVudE9wdGlvbnMuanN4SW5kZW50WzFdXG4gICAgaWYganN4SW5kZW50UHJvcHNcbiAgICAgIGlmIEBlc2xpbnRJbmRlbnRPcHRpb25zLmpzeEluZGVudFByb3BzWzBdXG4gICAgICAgIGlmIEBlc2xpbnRJbmRlbnRPcHRpb25zLmpzeEluZGVudFByb3BzWzFdXG4gICAgICAgICAgYmxvY2tJbmRlbnQgKz0ganN4SW5kZW50UHJvcHMgKiBAZXNsaW50SW5kZW50T3B0aW9ucy5qc3hJbmRlbnRQcm9wc1sxXVxuICAgICMgYWxsb3dBZGRpdGlvbmFsSW5kZW50cyBhbGxvd3MgaW5kZW50cyB0byBiZSBncmVhdGVyIHRoYW4gdGhlIG1pbmltdW1cbiAgICAjIHVzZWQgd2hlcmUgaXRlbXMgYXJlIGFsaWduZWQgYnV0IG5vIGVzbGludCBydWxlcyBhcmUgYXBwbGljYWJsZVxuICAgICMgc28gdXNlciBoYXMgc29tZSBkaXNjcmV0aW9uIGluIGFkZGluZyBtb3JlIGluZGVudHNcbiAgICBpZiBhbGxvd0FkZGl0aW9uYWxJbmRlbnRzXG4gICAgICBpZiBAZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KHJvdykgPCBibG9ja0luZGVudCBvclxuICAgICAgICBAZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KHJvdykgPiBibG9ja0luZGVudCArIGFsbG93QWRkaXRpb25hbEluZGVudHNcbiAgICAgICAgICBAZWRpdG9yLnNldEluZGVudGF0aW9uRm9yQnVmZmVyUm93IHJvdywgYmxvY2tJbmRlbnQsIHsgcHJlc2VydmVMZWFkaW5nV2hpdGVzcGFjZTogZmFsc2UgfVxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZVxuICAgICAgaWYgQGVkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhyb3cpIGlzbnQgYmxvY2tJbmRlbnRcbiAgICAgICAgQGVkaXRvci5zZXRJbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyByb3csIGJsb2NrSW5kZW50LCB7IHByZXNlcnZlTGVhZGluZ1doaXRlc3BhY2U6IGZhbHNlIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiJdfQ==
