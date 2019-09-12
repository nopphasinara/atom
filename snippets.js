var editor = activeEditor();
var selections = editor.getSelections();
if (selections.length > 0) {
	var selectedText = selections[0].getText();
	console.log(selectedText.search("\n"));
	console.log(selectedText, selectedText.length);
	console.log(selectedText.trim(), selectedText.trim().length);
	console.log(selections);
}
