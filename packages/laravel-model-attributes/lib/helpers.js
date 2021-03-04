function getWordAtPosition(line, pos) {
   // Perform type conversions.
   line = String(line);
   pos = Number(pos) >>> 0;

   // Search for the word's beginning and end.
   const left = Math.max.apply(null, [/\((?=[^(]*$)/,/\)(?=[^)]*$)/, /\,(?=[^,]*$)/, /\[(?=[^[]*$)/, /\](?=[^]]*$)/, /\;(?=[^;]*$)/, /\.(?=[^.]*$)/, /\s(?=[^\s]*$)/].map(x => line.slice(0, pos).search(x))) + 1
   let right = line.slice(pos).search(/\s|\(|\)|\,|\.|\[|\]|\;/)

   // The last word in the string is a special case.
   if (right < 0) {
      right = line.length - 1
   }

   // Return the word, using the located bounds to extract it from the string.
   return line.slice(left, right + pos)
};
function modelCaseTO_table_name(s) {
   let res = s.replace(/(?:^|\.?)([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "");
   return res.plural();
}
function findVariableDefinition(row,column,varname,textEditor) {
   var line;
   var n = row;
   var m;
   var re = new RegExp( "\\" + varname + "\s*[^=]?=" );
   while ( n-- > 0 ) {
      line = textEditor.buffer.lineForRow( n );
      if ( m = line.match( re ) )
      break;
   }
   if ( m == null || n == -1 )
   return;
   let modelName;
   if(line.toLowerCase().indexOf('new')>-1 && line.toLowerCase().indexOf('(')>-1) {
       modelName = line.substring((line.indexOf('new')+3),line.indexOf('(')).trim();
   }
   return modelCaseTO_table_name(modelName);
}

module.exports = {getWordAtPosition:getWordAtPosition,ModelCaseTO_table_name:modelCaseTO_table_name,findVariableDefinition:findVariableDefinition};
