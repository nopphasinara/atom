"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
function listen(element, event, selector, callback) {
    const bound = (evt) => {
        const sel = evt.target.closest(selector);
        if (sel && element.contains(sel)) {
            callback(evt);
        }
    };
    element.addEventListener(event, bound);
    return new atom_1.Disposable(() => {
        element.removeEventListener(event, bound);
    });
}
exports.listen = listen;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudC1saXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9lbGVtZW50LWxpc3RlbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQWlDO0FBRWpDLGdCQUNFLE9BQW9CLEVBQ3BCLEtBQVEsRUFDUixRQUFnQixFQUNoQixRQUFpRDtJQUVqRCxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQVUsRUFBRSxFQUFFO1FBQzNCLE1BQU0sR0FBRyxHQUFJLEdBQUcsQ0FBQyxNQUFzQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN6RCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2YsQ0FBQztJQUNILENBQUMsQ0FBQTtJQUNELE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDdEMsTUFBTSxDQUFDLElBQUksaUJBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDekIsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUMzQyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFoQkQsd0JBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW48VCBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50RXZlbnRNYXA+KFxuICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgZXZlbnQ6IFQsXG4gIHNlbGVjdG9yOiBzdHJpbmcsXG4gIGNhbGxiYWNrOiAoZXZlbnQ6IEhUTUxFbGVtZW50RXZlbnRNYXBbVF0pID0+IHZvaWQsXG4pOiBEaXNwb3NhYmxlIHtcbiAgY29uc3QgYm91bmQgPSAoZXZ0OiBFdmVudCkgPT4ge1xuICAgIGNvbnN0IHNlbCA9IChldnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KHNlbGVjdG9yKVxuICAgIGlmIChzZWwgJiYgZWxlbWVudC5jb250YWlucyhzZWwpKSB7XG4gICAgICBjYWxsYmFjayhldnQpXG4gICAgfVxuICB9XG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgYm91bmQpXG4gIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBib3VuZClcbiAgfSlcbn1cbiJdfQ==