"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const etch = require("etch");
const output_panel_item_1 = require("./output-panel-item");
class OutputPanelItems {
    constructor(props) {
        this.props = props;
        this.itemMap = new WeakMap();
        etch.initialize(this);
    }
    render() {
        return (etch.dom("ide-haskell-panel-items", { class: "native-key-bindings", tabIndex: "-1" }, this.renderItems()));
    }
    async update(props) {
        this.props = props;
        return etch.update(this);
    }
    async destroy() {
        await etch.destroy(this);
    }
    async showItem(item) {
        await etch.update(this);
        const view = this.itemMap.get(item);
        if (view) {
            view.component.clickPosition();
            view.domNode.scrollIntoView({
                block: 'start',
                behavior: 'smooth',
            });
        }
    }
    async scrollToEnd() {
        await etch.update(this);
        this.element.scrollTop = this.element.scrollHeight;
    }
    atEnd() {
        return (this.element.scrollTop >=
            this.element.scrollHeight - this.element.clientHeight);
    }
    renderItems() {
        const items = this.props.filter
            ? this.props.model.filter(this.props.filter)
            : this.props.model.results();
        return Array.from(items).map((item) => {
            const view = etch.dom(output_panel_item_1.OutputPanelItem, { model: item });
            this.itemMap.set(item, view);
            return view;
        });
    }
}
exports.OutputPanelItems = OutputPanelItems;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0LXBhbmVsLWl0ZW1zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL291dHB1dC1wYW5lbC92aWV3cy9vdXRwdXQtcGFuZWwtaXRlbXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLDJEQUFxRDtBQVFyRDtJQU1FLFlBQW1CLEtBQWE7UUFBYixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQTtRQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3ZCLENBQUM7SUFFTSxNQUFNO1FBQ1gsTUFBTSxDQUFDLENBQ0wsc0NBQXlCLEtBQUssRUFBQyxxQkFBcUIsRUFBQyxRQUFRLEVBQUMsSUFBSSxJQUMvRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQ0ssQ0FDM0IsQ0FBQTtJQUNILENBQUM7SUFFTSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQWE7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVNLEtBQUssQ0FBQyxPQUFPO1FBQ2xCLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFnQjtRQUNwQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNULElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUE7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7Z0JBQzFCLEtBQUssRUFBRSxPQUFPO2dCQUNkLFFBQVEsRUFBRSxRQUFRO2FBQ25CLENBQUMsQ0FBQTtRQUNKLENBQUM7SUFDSCxDQUFDO0lBRU0sS0FBSyxDQUFDLFdBQVc7UUFDdEIsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFBO0lBQ3BELENBQUM7SUFFTSxLQUFLO1FBQ1YsTUFBTSxDQUFDLENBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO1lBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUN0RCxDQUFBO0lBQ0gsQ0FBQztJQUVPLFdBQVc7UUFDakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO1lBQzdCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDNUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3BDLE1BQU0sSUFBSSxHQUFHLFNBQUMsbUNBQWUsSUFBQyxLQUFLLEVBQUUsSUFBSSxHQUFJLENBQUE7WUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQVcsQ0FBQyxDQUFBO1lBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUE7UUFDYixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQTlERCw0Q0E4REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBldGNoIGZyb20gJ2V0Y2gnXG5pbXBvcnQgeyBPdXRwdXRQYW5lbEl0ZW0gfSBmcm9tICcuL291dHB1dC1wYW5lbC1pdGVtJ1xuaW1wb3J0IHsgUmVzdWx0c0RCLCBSZXN1bHRJdGVtIH0gZnJvbSAnLi4vLi4vcmVzdWx0cy1kYidcblxuZXhwb3J0IGludGVyZmFjZSBJUHJvcHMgZXh0ZW5kcyBKU1guUHJvcHMge1xuICBtb2RlbDogUmVzdWx0c0RCXG4gIGZpbHRlcj86IChpdGVtOiBSZXN1bHRJdGVtKSA9PiBib29sZWFuXG59XG5cbmV4cG9ydCBjbGFzcyBPdXRwdXRQYW5lbEl0ZW1zIGltcGxlbWVudHMgSlNYLkVsZW1lbnRDbGFzcyB7XG4gIHByaXZhdGUgZWxlbWVudCE6IEhUTUxFbGVtZW50XG4gIHByaXZhdGUgaXRlbU1hcDogV2Vha01hcDxcbiAgICBSZXN1bHRJdGVtLFxuICAgIHsgY29tcG9uZW50OiBPdXRwdXRQYW5lbEl0ZW07IGRvbU5vZGU6IEhUTUxFbGVtZW50IH1cbiAgPlxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcHM6IElQcm9wcykge1xuICAgIHRoaXMuaXRlbU1hcCA9IG5ldyBXZWFrTWFwKClcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxpZGUtaGFza2VsbC1wYW5lbC1pdGVtcyBjbGFzcz1cIm5hdGl2ZS1rZXktYmluZGluZ3NcIiB0YWJJbmRleD1cIi0xXCI+XG4gICAgICAgIHt0aGlzLnJlbmRlckl0ZW1zKCl9XG4gICAgICA8L2lkZS1oYXNrZWxsLXBhbmVsLWl0ZW1zPlxuICAgIClcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB1cGRhdGUocHJvcHM6IElQcm9wcykge1xuICAgIHRoaXMucHJvcHMgPSBwcm9wc1xuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgcHVibGljIGFzeW5jIGRlc3Ryb3koKSB7XG4gICAgYXdhaXQgZXRjaC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2hvd0l0ZW0oaXRlbTogUmVzdWx0SXRlbSkge1xuICAgIGF3YWl0IGV0Y2gudXBkYXRlKHRoaXMpXG4gICAgY29uc3QgdmlldyA9IHRoaXMuaXRlbU1hcC5nZXQoaXRlbSlcbiAgICBpZiAodmlldykge1xuICAgICAgdmlldy5jb21wb25lbnQuY2xpY2tQb3NpdGlvbigpXG4gICAgICB2aWV3LmRvbU5vZGUuc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICBibG9jazogJ3N0YXJ0JyxcbiAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2Nyb2xsVG9FbmQoKSB7XG4gICAgYXdhaXQgZXRjaC51cGRhdGUodGhpcylcbiAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wID0gdGhpcy5lbGVtZW50LnNjcm9sbEhlaWdodFxuICB9XG5cbiAgcHVibGljIGF0RW5kKCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wID49XG4gICAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsSGVpZ2h0IC0gdGhpcy5lbGVtZW50LmNsaWVudEhlaWdodFxuICAgIClcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVySXRlbXMoKSB7XG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLnByb3BzLmZpbHRlclxuICAgICAgPyB0aGlzLnByb3BzLm1vZGVsLmZpbHRlcih0aGlzLnByb3BzLmZpbHRlcilcbiAgICAgIDogdGhpcy5wcm9wcy5tb2RlbC5yZXN1bHRzKClcbiAgICByZXR1cm4gQXJyYXkuZnJvbShpdGVtcykubWFwKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCB2aWV3ID0gPE91dHB1dFBhbmVsSXRlbSBtb2RlbD17aXRlbX0gLz5cbiAgICAgIHRoaXMuaXRlbU1hcC5zZXQoaXRlbSwgdmlldyBhcyBhbnkpXG4gICAgICByZXR1cm4gdmlld1xuICAgIH0pXG4gIH1cbn1cbiJdfQ==