"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const util_1 = require("../util");
function editorForId(editorId) {
    for (const editor of atom.workspace.getTextEditors()) {
        if (editor.id === editorId) {
            return editor;
        }
    }
    return undefined;
}
exports.editorForId = editorForId;
let getStylesOverride = undefined;
function __setGetStylesOverride(f) {
    getStylesOverride = f;
}
exports.__setGetStylesOverride = __setGetStylesOverride;
function* getStyles(context) {
    const elements = atom.styles.getStyleElements();
    for (const element of elements) {
        if (context === undefined || element.getAttribute('context') === context) {
            yield element.innerText;
        }
    }
}
function getClientStyle(file) {
    return atom.themes.loadStylesheet(path.join(__dirname, '..', '..', 'styles-client', `${file}.less`));
}
function getUserStyles() {
    const el = atom.styles.styleElementsBySourcePath[atom.styles.getUserStyleSheetPath()];
    if (!el)
        return [];
    return [el.innerText];
}
exports.getUserStyles = getUserStyles;
function getSyntaxTheme(themeName) {
    if (themeName !== '') {
        const themes = atom.themes.getLoadedThemes();
        if (themes) {
            const [theme] = themes.filter((x) => x.name === themeName);
            if (theme) {
                const stshts = theme
                    .getStylesheetPaths()
                    .map((p) => atom.themes.loadStylesheet(p));
                return processEditorStyles(stshts);
            }
        }
        atom.notifications.addWarning('Failed to load syntax theme', {
            detail: `Markdown-preview-plus couldn't find '${themeName}'`,
        });
    }
    return processEditorStyles(getStyles('atom-text-editor'));
}
function* getActivePackageStyles(packageName) {
    const pack = atom.packages.getActivePackage(packageName);
    if (!pack)
        return;
    const stylesheets = pack.getStylesheetPaths();
    for (const ss of stylesheets) {
        const element = atom.styles.styleElementsBySourcePath[ss];
        if (element)
            yield element.innerText;
    }
}
function getPreviewStyles(display) {
    if (getStylesOverride)
        return getStylesOverride(display);
    const styles = [];
    if (display) {
        const globalStyles = atom.styles.styleElementsBySourcePath['global-text-editor-styles'];
        if (globalStyles) {
            styles.push(...processWorkspaceStyles([globalStyles.innerText]));
        }
        styles.push(getClientStyle('editor-global-font'));
        const packList = util_1.atomConfig().importPackageStyles;
        if (packList.includes('*')) {
            styles.push(...processEditorStyles(getStyles()));
            styles.push(getClientStyle('patch'));
        }
        else {
            for (const pack of packList) {
                styles.push(...processEditorStyles(getActivePackageStyles(pack)));
            }
            if (packList.includes('fonts')) {
                const fontsVar = atom.styles.styleElementsBySourcePath['fonts-package-editorfont'];
                if (fontsVar)
                    styles.push(...processEditorStyles([fontsVar.innerText]));
            }
        }
    }
    styles.push(getClientStyle('generic'));
    if (display)
        styles.push(getClientStyle('display'));
    if (util_1.atomConfig().useGitHubStyle) {
        styles.push(getClientStyle('github'));
    }
    else {
        styles.push(getClientStyle('default'));
    }
    styles.push(...getSyntaxTheme(util_1.atomConfig().syntaxThemeName));
    styles.push(...processEditorStyles(getUserStyles()));
    return styles;
}
exports.getPreviewStyles = getPreviewStyles;
function* processEditorStyles(styles) {
    for (const style of styles) {
        yield style.replace(/\batom-text-editor\b/g, 'pre.editor-colors');
    }
}
function* processWorkspaceStyles(styles) {
    for (const style of styles) {
        yield style.replace(/\batom-workspace\b/g, ':root');
    }
}
function getMarkdownPreviewCSS() {
    const cssUrlRefExp = /url\(atom:\/\/markdown-preview-plus\/assets\/(.*)\)/;
    return getPreviewStyles(false)
        .join('\n')
        .replace(cssUrlRefExp, function (_match, assetsName, _offset, _string) {
        const assetPath = path.join(__dirname, '../../assets', assetsName);
        const originalData = fs.readFileSync(assetPath, 'binary');
        const base64Data = new Buffer(originalData, 'binary').toString('base64');
        return `url('data:image/jpeg;base64,${base64Data}')`;
    });
}
function buildLineMap(html) {
    const domparser = new DOMParser();
    const dom = domparser.parseFromString(html, 'text/html');
    const map = {};
    for (const elem of Array.from(dom.querySelectorAll(`[data-source-lines]`))) {
        const he = elem;
        const [start, end] = he.dataset
            .sourceLines.split(' ')
            .map((x) => parseInt(x, 10));
        let e = elem;
        const path = [];
        while (e && e.tagName !== 'BODY') {
            let index = 0;
            let sib = e;
            while (sib.previousElementSibling) {
                sib = sib.previousElementSibling;
                if (sib.tagName === e.tagName)
                    index++;
            }
            path.unshift({ tag: e.tagName.toLowerCase(), index });
            e = e.parentElement;
        }
        for (let i = start; i < end; ++i) {
            if (!map[i] || map[i].length < path.length)
                map[i] = path;
        }
    }
    return map;
}
exports.buildLineMap = buildLineMap;
function mathJaxScript(texConfig) {
    return `\
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
    jax: ["input/TeX","output/HTML-CSS"],
    extensions: ["[a11y]/accessibility-menu.js"],
    'HTML-CSS': {
      availableFonts: [],
      webFont: 'TeX',
      undefinedFamily: ${JSON.stringify(util_1.atomConfig().mathConfig.undefinedFamily)},
      mtextFontInherit: true,
    },
    TeX: ${JSON.stringify(texConfig, undefined, 2)},
    showMathMenu: true
  });
</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js"></script>`;
}
function mkHtml(title, html, renderLaTeX, texConfig) {
    let maybeMathJaxScript;
    if (renderLaTeX) {
        maybeMathJaxScript = mathJaxScript(texConfig);
    }
    else {
        maybeMathJaxScript = '';
    }
    return `\
<!DOCTYPE html>
<html data-markdown-preview-plus-context="html-export">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>${maybeMathJaxScript}
    <style>${getMarkdownPreviewCSS()}</style>
${html.head.innerHTML}
  </head>
  <body>
    ${html.body.innerHTML}
  </body>
</html>
`;
}
exports.mkHtml = mkHtml;
function destroy(item) {
    const pane = atom.workspace.paneForItem(item);
    if (pane)
        util_1.handlePromise(pane.destroyItem(item));
}
exports.destroy = destroy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYXJrZG93bi1wcmV2aWV3LXZpZXcvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDZCQUE0QjtBQUM1Qix5QkFBd0I7QUFDeEIsa0NBQW1EO0FBRW5ELFNBQWdCLFdBQVcsQ0FBQyxRQUFnQjtJQUMxQyxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLEVBQUU7UUFDcEQsSUFBSSxNQUFNLENBQUMsRUFBRSxLQUFLLFFBQVEsRUFBRTtZQUMxQixPQUFPLE1BQU0sQ0FBQTtTQUNkO0tBQ0Y7SUFDRCxPQUFPLFNBQVMsQ0FBQTtBQUNsQixDQUFDO0FBUEQsa0NBT0M7QUFHRCxJQUFJLGlCQUFpQixHQUF3QyxTQUFTLENBQUE7QUFFdEUsU0FBZ0Isc0JBQXNCLENBQUMsQ0FBMkI7SUFDaEUsaUJBQWlCLEdBQUcsQ0FBQyxDQUFBO0FBQ3ZCLENBQUM7QUFGRCx3REFFQztBQUVELFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUF1QjtJQUN6QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUE7SUFFL0MsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUU7UUFDOUIsSUFBSSxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssT0FBTyxFQUFFO1lBQ3hFLE1BQU0sT0FBTyxDQUFDLFNBQVMsQ0FBQTtTQUN4QjtLQUNGO0FBQ0gsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLElBQVk7SUFDbEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUNsRSxDQUFBO0FBQ0gs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LElBQUksQ0FBQTtTQUMxRDtLQUNGO0lBQ0QsT0FBTyxHQUFHLENBQUE7QUFDWixDQUFDO0FBM0JELG9DQTJCQztBQUVELFNBQVMsYUFBYSxDQUFDLFNBQW9DO0lBQ3pELE9BQU87Ozs7Ozs7O3lCQVFnQixJQUFJLENBQUMsU0FBUyxDQUMvQixpQkFBVSxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FDeEM7OztXQUdJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7Ozs7K0dBSTZELENBQUE7QUFDL0csQ0FBQztBQUVELFNBQWdCLE1BQU0sQ0FDcEIsS0FBYSxFQUNiLElBQWtCLEVBQ2xCLFdBQW9CLEVBQ3BCLFNBQW9DO0lBRXBDLElBQUksa0JBQTBCLENBQUE7SUFDOUIsSUFBSSxXQUFXLEVBQUU7UUFDZixrQkFBa0IsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUE7S0FDOUM7U0FBTTtRQUNMLGtCQUFrQixHQUFHLEVBQUUsQ0FBQTtLQUN4QjtJQUNELE9BQU87Ozs7O2FBS0ksS0FBSyxXQUFXLGtCQUFrQjthQUNsQyxxQkFBcUIsRUFBRTtFQUNsQyxJQUFJLENBQUMsSUFBSyxDQUFDLFNBQVM7OztNQUdoQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7OztDQUd4QixDQUFBO0FBQ0QsQ0FBQztBQTFCRCx3QkEwQkM7QUFFRCxTQUFnQixPQUFPLENBQUMsSUFBWTtJQUNsQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM3QyxJQUFJLElBQUk7UUFBRSxvQkFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtBQUNqRCxDQUFDO0FBSEQsMEJBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSdcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHsgaGFuZGxlUHJvbWlzZSwgYXRvbUNvbmZpZyB9IGZyb20gJy4uL3V0aWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBlZGl0b3JGb3JJZChlZGl0b3JJZDogbnVtYmVyKTogVGV4dEVkaXRvciB8IHVuZGVmaW5lZCB7XG4gIGZvciAoY29uc3QgZWRpdG9yIG9mIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkpIHtcbiAgICBpZiAoZWRpdG9yLmlkID09PSBlZGl0b3JJZCkge1xuICAgICAgcmV0dXJuIGVkaXRvclxuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkXG59XG5cbi8vIHRoaXMgd2VpcmRuZXNzIGFsbG93cyBvdmVycmlkaW5nIGluIHRlc3RzXG5sZXQgZ2V0U3R5bGVzT3ZlcnJpZGU6IHR5cGVvZiBnZXRQcmV2aWV3U3R5bGVzIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cbmV4cG9ydCBmdW5jdGlvbiBfX3NldEdldFN0eWxlc092ZXJyaWRlKGY/OiB0eXBlb2YgZ2V0UHJldmlld1N0eWxlcykge1xuICBnZXRTdHlsZXNPdmVycmlkZSA9IGZcbn1cblxuZnVuY3Rpb24qIGdldFN0eWxlcyhjb250ZXh0Pzogc3RyaW5nIHwgbnVsbCk6IEl0ZXJhYmxlSXRlcmF0b3I8c3RyaW5nPiB7XG4gIGNvbnN0IGVsZW1lbnRzID0gYXRvbS5zdHlsZXMuZ2V0U3R5bGVFbGVtZW50cygpXG5cbiAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgaWYgKGNvbnRleHQgPT09IHVuZGVmaW5lZCB8fCBlbGVtZW50LmdldEF0dHJpYnV0ZSgnY29udGV4dCcpID09PSBjb250ZXh0KSB7XG4gICAgICB5aWVsZCBlbGVtZW50LmlubmVyVGV4dFxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRDbGllbnRTdHlsZShmaWxlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYXRvbS50aGVtZXMubG9hZFN0eWxlc2hlZXQoXG4gICAgcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJ3N0eWxlcy1jbGllbnQnLCBgJHtmaWxlfS5sZXNzYCksXG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVzZXJTdHlsZXMoKSB7XG4gIGNvbnN0IGVsID1cbiAgICBhdG9tLnN0eWxlcy5zdHlsZUVsZW1lbnRzQnlTb3VyY2VQYXRoW2F0b20uc3R5bGVzLmdldFVzZXJTdHlsZVNoZWV0UGF0aCgpXVxuICBpZiAoIWVsKSByZXR1cm4gW11cbiAgcmV0dXJuIFtlbC5pbm5lclRleHRdXG59XG5cbmZ1bmN0aW9uIGdldFN5bnRheFRoZW1lKHRoZW1lTmFtZTogc3RyaW5nKTogSXRlcmFibGU8c3RyaW5nPiB7XG4gIGlmICh0aGVtZU5hbWUgIT09ICcnKSB7XG4gICAgY29uc3QgdGhlbWVzID0gYXRvbS50aGVtZXMuZ2V0TG9hZGVkVGhlbWVzKClcbiAgICBpZiAodGhlbWVzKSB7XG4gICAgICBjb25zdCBbdGhlbWVdID0gdGhlbWVzLmZpbHRlcigoeCkgPT4geC5uYW1lID09PSB0aGVtZU5hbWUpXG4gICAgICBpZiAodGhlbWUpIHtcbiAgICAgICAgY29uc3Qgc3RzaHRzID0gdGhlbWVcbiAgICAgICAgICAuZ2V0U3R5bGVzaGVldFBhdGhzKClcbiAgICAgICAgICAubWFwKChwKSA9PiBhdG9tLnRoZW1lcy5sb2FkU3R5bGVzaGVldChwKSlcbiAgICAgICAgcmV0dXJuIHByb2Nlc3NFZGl0b3JTdHlsZXMoc3RzaHRzKVxuICAgICAgfVxuICAgIH1cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnRmFpbGVkIHRvIGxvYWQgc3ludGF4IHRoZW1lJywge1xuICAgICAgZGV0YWlsOiBgTWFya2Rvd24tcHJldmlldy1wbHVzIGNvdWxkbid0IGZpbmQgJyR7dGhlbWVOYW1lfSdgLFxuICAgIH0pXG4gIH1cbiAgLy8gZGVmYXVsdFxuICByZXR1cm4gcHJvY2Vzc0VkaXRvclN0eWxlcyhnZXRTdHlsZXMoJ2F0b20tdGV4dC1lZGl0b3InKSlcbn1cblxuZnVuY3Rpb24qIGdldEFjdGl2ZVBhY2thZ2VTdHlsZXMoXG4gIHBhY2thZ2VOYW1lOiBzdHJpbmcsXG4pOiBJdGVyYWJsZUl0ZXJhdG9yPHN0cmluZz4ge1xuICBjb25zdCBwYWNrID0gYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKHBhY2thZ2VOYW1lKVxuICBpZiAoIXBhY2spIHJldHVyblxuICBjb25zdCBzdHlsZXNoZWV0cyA9IHBhY2suZ2V0U3R5bGVzaGVldFBhdGhzKClcbiAgZm9yIChjb25zdCBzcyBvZiBzdHlsZXNoZWV0cykge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBhdG9tLnN0eWxlcy5zdHlsZUVsZW1lbnRzQnlTb3VyY2VQYXRoW3NzXVxuICAgIGlmIChlbGVtZW50KSB5aWVsZCBlbGVtZW50LmlubmVyVGV4dFxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcmV2aWV3U3R5bGVzKGRpc3BsYXk6IGJvb2xlYW4pOiBzdHJpbmdbXSB7XG4gIGlmIChnZXRTdHlsZXNPdmVycmlkZSkgcmV0dXJuIGdldFN0eWxlc092ZXJyaWRlKGRpc3BsYXkpXG4gIGNvbnN0IHN0eWxlcyA9IFtdXG4gIGlmIChkaXNwbGF5KSB7XG4gICAgLy8gZ2xvYmFsIGVkaXRvciBzdHlsZXNcbiAgICBjb25zdCBnbG9iYWxTdHlsZXMgPVxuICAgICAgYXRvbS5zdHlsZXMuc3R5bGVFbGVtZW50c0J5U291cmNlUGF0aFsnZ2xvYmFsLXRleHQtZWRpdG9yLXN0eWxlcyddXG4gICAgaWYgKGdsb2JhbFN0eWxlcykge1xuICAgICAgc3R5bGVzLnB1c2goLi4ucHJvY2Vzc1dvcmtzcGFjZVN0eWxlcyhbZ2xvYmFsU3R5bGVzLmlubmVyVGV4dF0pKVxuICAgIH1cbiAgICBzdHlsZXMucHVzaChnZXRDbGllbnRTdHlsZSgnZWRpdG9yLWdsb2JhbC1mb250JykpXG4gICAgLy8gcGFja2FnZSBzdHlsZXNcbiAgICBjb25zdCBwYWNrTGlzdCA9IGF0b21Db25maWcoKS5pbXBvcnRQYWNrYWdlU3R5bGVzXG4gICAgaWYgKHBhY2tMaXN0LmluY2x1ZGVzKCcqJykpIHtcbiAgICAgIHN0eWxlcy5wdXNoKC4uLnByb2Nlc3NFZGl0b3JTdHlsZXMoZ2V0U3R5bGVzKCkpKVxuICAgICAgc3R5bGVzLnB1c2goZ2V0Q2xpZW50U3R5bGUoJ3BhdGNoJykpXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3QgcGFjayBvZiBwYWNrTGlzdCkge1xuICAgICAgICBzdHlsZXMucHVzaCguLi5wcm9jZXNzRWRpdG9yU3R5bGVzKGdldEFjdGl2ZVBhY2thZ2VTdHlsZXMocGFjaykpKVxuICAgICAgfVxuICAgICAgLy8gZXhwbGljaXQgY29tcGF0aWJpbGl0eSB3aXRoIHRoZSBmb250cyBwYWNrYWdlXG4gICAgICBpZiAocGFja0xpc3QuaW5jbHVkZXMoJ2ZvbnRzJykpIHtcbiAgICAgICAgY29uc3QgZm9udHNWYXIgPVxuICAgICAgICAgIGF0b20uc3R5bGVzLnN0eWxlRWxlbWVudHNCeVNvdXJjZVBhdGhbJ2ZvbnRzLXBhY2thZ2UtZWRpdG9yZm9udCddXG4gICAgICAgIGlmIChmb250c1Zhcikgc3R5bGVzLnB1c2goLi4ucHJvY2Vzc0VkaXRvclN0eWxlcyhbZm9udHNWYXIuaW5uZXJUZXh0XSkpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3R5bGVzLnB1c2goZ2V0Q2xpZW50U3R5bGUoJ2dlbmVyaWMnKSlcbiAgaWYgKGRpc3BsYXkpIHN0eWxlcy5wdXNoKGdldENsaWVudFN0eWxlKCdkaXNwbGF5JykpXG4gIGlmIChhdG9tQ29uZmlnKCkudXNlR2l0SHViU3R5bGUpIHtcbiAgICBzdHlsZXMucHVzaChnZXRDbGllbnRTdHlsZSgnZ2l0aHViJykpXG4gIH0gZWxzZSB7XG4gICAgc3R5bGVzLnB1c2goZ2V0Q2xpZW50U3R5bGUoJ2RlZmF1bHQnKSlcbiAgfVxuICBzdHlsZXMucHVzaCguLi5nZXRTeW50YXhUaGVtZShhdG9tQ29uZmlnKCkuc3ludGF4VGhlbWVOYW1lKSlcbiAgc3R5bGVzLnB1c2goLi4ucHJvY2Vzc0VkaXRvclN0eWxlcyhnZXRVc2VyU3R5bGVzKCkpKVxuICByZXR1cm4gc3R5bGVzXG59XG5cbmZ1bmN0aW9uKiBwcm9jZXNzRWRpdG9yU3R5bGVzKHN0eWxlczogSXRlcmFibGU8c3RyaW5nPikge1xuICBmb3IgKGNvbnN0IHN0eWxlIG9mIHN0eWxlcykge1xuICAgIHlpZWxkIHN0eWxlLnJlcGxhY2UoL1xcYmF0b20tdGV4dC1lZGl0b3JcXGIvZywgJ3ByZS5lZGl0b3ItY29sb3JzJylcbiAgfVxufVxuXG5mdW5jdGlvbiogcHJvY2Vzc1dvcmtzcGFjZVN0eWxlcyhzdHlsZXM6IEl0ZXJhYmxlPHN0cmluZz4pIHtcbiAgZm9yIChjb25zdCBzdHlsZSBvZiBzdHlsZXMpIHtcbiAgICB5aWVsZCBzdHlsZS5yZXBsYWNlKC9cXGJhdG9tLXdvcmtzcGFjZVxcYi9nLCAnOnJvb3QnKVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldE1hcmtkb3duUHJldmlld0NTUygpIHtcbiAgY29uc3QgY3NzVXJsUmVmRXhwID0gL3VybFxcKGF0b206XFwvXFwvbWFya2Rvd24tcHJldmlldy1wbHVzXFwvYXNzZXRzXFwvKC4qKVxcKS9cblxuICByZXR1cm4gZ2V0UHJldmlld1N0eWxlcyhmYWxzZSlcbiAgICAuam9pbignXFxuJylcbiAgICAucmVwbGFjZShjc3NVcmxSZWZFeHAsIGZ1bmN0aW9uKFxuICAgICAgX21hdGNoLFxuICAgICAgYXNzZXRzTmFtZTogc3RyaW5nLFxuICAgICAgX29mZnNldCxcbiAgICAgIF9zdHJpbmcsXG4gICAgKSB7XG4gICAgICAvLyBiYXNlNjQgZW5jb2RlIGFzc2V0c1xuICAgICAgY29uc3QgYXNzZXRQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL2Fzc2V0cycsIGFzc2V0c05hbWUpXG4gICAgICBjb25zdCBvcmlnaW5hbERhdGEgPSBmcy5yZWFkRmlsZVN5bmMoYXNzZXRQYXRoLCAnYmluYXJ5JylcbiAgICAgIGNvbnN0IGJhc2U2NERhdGEgPSBuZXcgQnVmZmVyKG9yaWdpbmFsRGF0YSwgJ2JpbmFyeScpLnRvU3RyaW5nKCdiYXNlNjQnKVxuICAgICAgcmV0dXJuIGB1cmwoJ2RhdGE6aW1hZ2UvanBlZztiYXNlNjQsJHtiYXNlNjREYXRhfScpYFxuICAgIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExpbmVNYXAoaHRtbDogc3RyaW5nKSB7XG4gIGNvbnN0IGRvbXBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuICBjb25zdCBkb20gPSBkb21wYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWwsICd0ZXh0L2h0bWwnKVxuXG4gIGNvbnN0IG1hcDogeyBbbGluZTogbnVtYmVyXTogeyB0YWc6IHN0cmluZzsgaW5kZXg6IG51bWJlciB9W10gfSA9IHt9XG4gIGZvciAoY29uc3QgZWxlbSBvZiBBcnJheS5mcm9tKGRvbS5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS1zb3VyY2UtbGluZXNdYCkpKSB7XG4gICAgY29uc3QgaGUgPSBlbGVtIGFzIEhUTUxFbGVtZW50XG4gICAgY29uc3QgW3N0YXJ0LCBlbmRdID0gaGUuZGF0YXNldFxuICAgICAgLnNvdXJjZUxpbmVzIS5zcGxpdCgnICcpXG4gICAgICAubWFwKCh4KSA9PiBwYXJzZUludCh4LCAxMCkpXG4gICAgbGV0IGU6IEVsZW1lbnQgfCBudWxsID0gZWxlbVxuICAgIGNvbnN0IHBhdGggPSBbXVxuICAgIHdoaWxlIChlICYmIGUudGFnTmFtZSAhPT0gJ0JPRFknKSB7XG4gICAgICBsZXQgaW5kZXggPSAwXG4gICAgICBsZXQgc2liOiBFbGVtZW50ID0gZVxuICAgICAgd2hpbGUgKHNpYi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKSB7XG4gICAgICAgIHNpYiA9IHNpYi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXG4gICAgICAgIGlmIChzaWIudGFnTmFtZSA9PT0gZS50YWdOYW1lKSBpbmRleCsrXG4gICAgICB9XG4gICAgICBwYXRoLnVuc2hpZnQoeyB0YWc6IGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLCBpbmRleCB9KVxuICAgICAgZSA9IGUucGFyZW50RWxlbWVudFxuICAgIH1cbiAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgaWYgKCFtYXBbaV0gfHwgbWFwW2ldLmxlbmd0aCA8IHBhdGgubGVuZ3RoKSBtYXBbaV0gPSBwYXRoXG4gICAgfVxuICB9XG4gIHJldHVybiBtYXBcbn1cblxuZnVuY3Rpb24gbWF0aEpheFNjcmlwdCh0ZXhDb25maWc6IE1hdGhKYXguVGVYSW5wdXRQcm9jZXNzb3IpIHtcbiAgcmV0dXJuIGBcXFxuPHNjcmlwdCB0eXBlPVwidGV4dC94LW1hdGhqYXgtY29uZmlnXCI+XG4gIE1hdGhKYXguSHViLkNvbmZpZyh7XG4gICAgamF4OiBbXCJpbnB1dC9UZVhcIixcIm91dHB1dC9IVE1MLUNTU1wiXSxcbiAgICBleHRlbnNpb25zOiBbXCJbYTExeV0vYWNjZXNzaWJpbGl0eS1tZW51LmpzXCJdLFxuICAgICdIVE1MLUNTUyc6IHtcbiAgICAgIGF2YWlsYWJsZUZvbnRzOiBbXSxcbiAgICAgIHdlYkZvbnQ6ICdUZVgnLFxuICAgICAgdW5kZWZpbmVkRmFtaWx5OiAke0pTT04uc3RyaW5naWZ5KFxuICAgICAgICBhdG9tQ29uZmlnKCkubWF0aENvbmZpZy51bmRlZmluZWRGYW1pbHksXG4gICAgICApfSxcbiAgICAgIG10ZXh0Rm9udEluaGVyaXQ6IHRydWUsXG4gICAgfSxcbiAgICBUZVg6ICR7SlNPTi5zdHJpbmdpZnkodGV4Q29uZmlnLCB1bmRlZmluZWQsIDIpfSxcbiAgICBzaG93TWF0aE1lbnU6IHRydWVcbiAgfSk7XG48L3NjcmlwdD5cbjxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL21hdGhqYXgvMi43LjQvTWF0aEpheC5qc1wiPjwvc2NyaXB0PmBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1rSHRtbChcbiAgdGl0bGU6IHN0cmluZyxcbiAgaHRtbDogSFRNTERvY3VtZW50LFxuICByZW5kZXJMYVRlWDogYm9vbGVhbixcbiAgdGV4Q29uZmlnOiBNYXRoSmF4LlRlWElucHV0UHJvY2Vzc29yLFxuKSB7XG4gIGxldCBtYXliZU1hdGhKYXhTY3JpcHQ6IHN0cmluZ1xuICBpZiAocmVuZGVyTGFUZVgpIHtcbiAgICBtYXliZU1hdGhKYXhTY3JpcHQgPSBtYXRoSmF4U2NyaXB0KHRleENvbmZpZylcbiAgfSBlbHNlIHtcbiAgICBtYXliZU1hdGhKYXhTY3JpcHQgPSAnJ1xuICB9XG4gIHJldHVybiBgXFxcbjwhRE9DVFlQRSBodG1sPlxuPGh0bWwgZGF0YS1tYXJrZG93bi1wcmV2aWV3LXBsdXMtY29udGV4dD1cImh0bWwtZXhwb3J0XCI+XG4gIDxoZWFkPlxuICAgIDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiIC8+XG4gICAgPHRpdGxlPiR7dGl0bGV9PC90aXRsZT4ke21heWJlTWF0aEpheFNjcmlwdH1cbiAgICA8c3R5bGU+JHtnZXRNYXJrZG93blByZXZpZXdDU1MoKX08L3N0eWxlPlxuJHtodG1sLmhlYWQhLmlubmVySFRNTH1cbiAgPC9oZWFkPlxuICA8Ym9keT5cbiAgICAke2h0bWwuYm9keS5pbm5lckhUTUx9XG4gIDwvYm9keT5cbjwvaHRtbD5cbmAgLy8gRW5zdXJlIHRyYWlsaW5nIG5ld2xpbmVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3koaXRlbTogb2JqZWN0KSB7XG4gIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShpdGVtKVxuICBpZiAocGFuZSkgaGFuZGxlUHJvbWlzZShwYW5lLmRlc3Ryb3lJdGVtKGl0ZW0pKVxufVxuIl19