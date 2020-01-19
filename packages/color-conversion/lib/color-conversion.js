'use babel';

import {CompositeDisposable} from 'atom';

export default {
    subscriptions : null,

    activate() {
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'color-conversion:selection-to-rgba': () => this.toRgba()
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'color-conversion:selection-to-hsla': () => this.toHsla()
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'color-conversion:selection-to-hex': () => this.toHex()
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

	toRgba() {
		let selectionData = this.detectSelectionType();
		if (!selectionData) return;

		let color = selectionData.color;
		let editor = selectionData.editor;
		let suffix = selectionData.suffix;
		this.putInEditor(editor, ['rgba(',color.r,',',color.g,',',color.b,',',color.a,')',suffix].join(''));
	},

	toHsla() {
		let selectionData = this.detectSelectionType();
		if (!selectionData) return;

		let color = selectionData.color;
		let editor = selectionData.editor;
		let suffix = selectionData.suffix;

		let hsl = this.rgbToHsl(color.r, color.g, color.b);
		hsl[0] *= 360;
		hsl[1] *= 100;
		hsl[2] *= 100;

		this.putInEditor(editor, ['hsla(',hsl[0].toFixed(3),',',hsl[1].toFixed(3),'%,',hsl[2].toFixed(3),'%,',color.a,')',suffix].join(''));

	},

	toHex() {
		let selectionData = this.detectSelectionType();
		if (!selectionData) return;

		let color = selectionData.color;
		let editor = selectionData.editor;
		let suffix = selectionData.suffix;
		let hx = ""+this.componentToHex(color.r) +this.componentToHex(color.g)+ this.componentToHex(color.b);

		if (hx[0] == hx[1] &&  hx[2] == hx[3] &&  hx[4] == hx[5])
             hx = hx[0] + hx[2] + hx[4];

		this.putInEditor(editor, "#" + hx + suffix)
	},

	putInEditor(editor, text) {
		editor.delete();
		editor.insertText(text);
	},

	detectSelectionType() {
		let success = true;
		let me = this;
		let editor = atom.workspace.getActiveTextEditor();
		if (!editor) return false;

		let selection = editor.getSelectedText()
		if (!selection) return false;

		let rgbaRegex = /rgba*\s*\(\s*(.*)\s*,\s*(.*)\s*,\s*(.*)\s*,*\s*(.*)\s*\)(\;*)/i;
		let hslaRegex = /hsla*\s*\(\s*(.*)\s*,\s*(.*)\s*,\s*(.*)\s*,*\s*(.*)\s*\)(\;*)/i;
		let selectionType = 'hex';
		let color = {
			r:0,
			g:0,
			b:0,
			a:1
		};
		let suffix = '';

		if (selection.indexOf(';') > -1)
			suffix = ';';

		if (rgbaRegex.test(selection))
			selectionType = 'rgba';
		else if (hslaRegex.test(selection))
			selectionType = 'hsla';

		selection = selection.replace(';', '');

		switch (selectionType) {
			case 'rgba':
			case 'hsla':
				try {
					selection = selection.replace(/rgb|hsl/i, '');
					selection = selection.replace(/a/i, '');
					selection = selection.replace(/\(/, '');
					selection = selection.replace(/\)/, '');
					selection = selection.replace(/\s*/g, '');

					let arrx = selection.split(',');
					if (selectionType == 'rgba') {
						color.r = arrx[0];
						color.g = arrx[1];
						color.b = arrx[2];
					} else if (selectionType == 'hsla') {
						let hsl = me.hslToRgb(
							arrx[0] / 360,
							arrx[1].replace('%','') / 100,
							arrx[2].replace('%','') / 100,

						);

						color.r = hsl[0];
						color.g = hsl[1];
						color.b = hsl[2];
					}

					if (arrx[3])
						color.a = arrx[3];
				}
				catch(err) {
					success = false;
					atom.notifications.addError('the selection is not a proper RGB|RGBA|HSL|HSLA');
				}
				break;
			case 'hex':
				try {
					selection = selection.replace('#', '');

					if (selection.length == 3) {
						let arrx = [];
						for (let i = 0; i < selection.length; i++) {
							arrx.push(selection.substring(i, i+1));
							arrx.push(selection.substring(i, i+1));
						}
						console.log(arrx);
						selection = arrx.join('');
					}

					color.r = parseInt(selection.substring(0,2), 16);
					color.g = parseInt(selection.substring(2,4), 16);
					color.b = parseInt(selection.substring(4,6), 16);
				}
				catch (err) {
					success = false;
					atom.notifications.addError('the selection is not a proper HEX');
				}
				break;
		}

		if (!success) return false;

		return {
			editor: editor,
			selectionType: selectionType,
			color: color,
			suffix: suffix
		}
	},
	/**
	 * http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h, s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 *
	 * @param   {number}  h       The hue
	 * @param   {number}  s       The saturation
	 * @param   {number}  l       The lightness
	 * @return  {Array}           The RGB representation
	 */
	hslToRgb(h, s, l){
	    var r, g, b;

	    if(s == 0){
	        r = g = b = l; // achromatic
	    }else{
	        var hue2rgb = function hue2rgb(p, q, t){
	            if(t < 0) t += 1;
	            if(t > 1) t -= 1;
	            if(t < 1/6) return p + (q - p) * 6 * t;
	            if(t < 1/2) return q;
	            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	            return p;
	        }

	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3);
	    }

	    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	},

	/**
	 * http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
	 * Converts an RGB color value to HSL. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h, s, and l in the set [0, 1].
	 *
	 * @param   {number}  r       The red color value
	 * @param   {number}  g       The green color value
	 * @param   {number}  b       The blue color value
	 * @return  {Array}           The HSL representation
	 */
	rgbToHsl(r, g, b){
	    r /= 255, g /= 255, b /= 255;
	    var max = Math.max(r, g, b), min = Math.min(r, g, b);
	    var h, s, l = (max + min) / 2;

	    if(max == min){
	        h = s = 0; // achromatic
	    }else{
	        var d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	        switch(max){
	            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	            case g: h = (b - r) / d + 2; break;
	            case b: h = (r - g) / d + 4; break;
	        }
	        h /= 6;
	    }

	    return [h, s, l];
	},

	componentToHex (c) {
        c = new Number(c);
        let hex = c.toString(16);
        if (hex.length == 1)
            hex = "0" + hex;

        return hex;
	}
};
