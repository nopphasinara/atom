console.clear();

var templateWrapper = '{\n\t"title": "Advance Key Bindings",\n\t"rules": [\n{{ITEMS}}\n]\n}';

var template = '{\n\t"description": "{{DESCRIPTION}}",\n\t"manipulators": [\n\t\t{\n\t\t\t"type": "basic",\n\t\t\t"from": {\n\t\t\t\t"modifiers": {\n\t\t\t\t\t"mandatory": [\n\t\t\t\t\t\t"fn"\n\t\t\t\t\t],\n\t\t\t\t\t"optional": [\n\t\t\t\t\t\t"shift"\n\t\t\t\t\t]\n\t\t\t\t},\n\t\t\t\t"key_code": "{{KEY_CODE}}"\n\t\t\t},\n\t\t\t"to": [\n\t\t\t\t{\n\t\t\t\t\t"modifiers": [\n\t\t\t\t\t\t"control",\n\t\t\t\t\t\t"option",\n\t\t\t\t\t\t"command"\n\t\t\t\t\t],\n\t\t\t\t\t"key_code": "{{KEY_CODE}}"\n\t\t\t\t}\n\t\t\t],\n\t\t\t"conditions": [\n\t\t\t\t{\n\t\t\t\t\t"type": "frontmost_application_if",\n\t\t\t\t\t"bundle_identifiers": [\n\t\t\t\t\t\t"com.github.atom"\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t]\n\t\t}\n\t]\n}';

var templateItems = '{\n\t"title": "Advance Key Bindings",\n\t"rules": [\n\t\t{\n\t\t\t"description": "Binding Fn to ⌃⌥⌘",\n\t\t\t"manipulators": [\n\t\t\t\t{{ITEMS}}\n\t\t\t]\n\t\t}\n\t]\n}'

var templateCondition = '';
// var templateCondition = ',\n\t"conditions": [\n\t\t{\n\t\t\t"type": "frontmost_application_if",\n\t\t\t"bundle_identifiers": [\n\t\t\t\t"com.github.atom"\n\t\t\t]\n\t\t}\n\t]';

var templateItem = '{\n\t"type": "basic",\n\t"from": {\n\t\t"modifiers": {\n\t\t\t"mandatory": [\n\t\t\t\t"fn"\n\t\t\t]\n\t\t},\n\t\t"key_code": "{{KEY_CODE}}"\n\t},\n\t"to": [\n\t\t{\n\t\t\t"modifiers": [\n\t\t\t\t"control",\n\t\t\t\t"option",\n\t\t\t\t"command"\n\t\t\t],\n\t\t\t"key_code": "{{KEY_CODE}}"\n\t\t}\n\t]'+ templateCondition +'\n}';

var templateItemShift = '{\n\t"type": "basic",\n\t"from": {\n\t\t"modifiers": {\n\t\t\t"mandatory": [\n\t\t\t\t"fn",\n\t\t\t\t"shift"\n\t\t\t]\n\t\t},\n\t\t"key_code": "{{KEY_CODE}}"\n\t},\n\t"to": [\n\t\t{\n\t\t\t"modifiers": [\n\t\t\t\t"shift",\n\t\t\t\t"control",\n\t\t\t\t"option",\n\t\t\t\t"command"\n\t\t\t],\n\t\t\t"key_code": "{{KEY_CODE}}"\n\t\t}\n\t]'+ templateCondition +'\n}';

var names = {
  '_': 'hyphen',
  '=': 'equal_sign',
  '\\': 'backslash',
  '/': 'slash',
  ',': 'comma',
  '.': 'period',
  ';': 'semicolon',
  '\'': 'quote',
  '[': 'open_bracket',
  ']': 'close_bracket',
  // '\r': 'return_or_enter',
  // '\d': 'delete_or_backspace',
};

var letters = 'abcdefghijklmnopqrstuvwxyz0123456789_=\\/,.;\'[]';
letters = letters.split('');
letters.push('return_or_enter');
letters.push('delete_or_backspace');
letters.push('grave_accent_and_tilde');
letters.push('escape');
// letters.push('eject');

var jsonContent = [];

for (let i = 0; i < letters.length; i++) {
  var result = '';
  var letter = letters[i];
  var name = names[letter] || letter;
  var label = (!name) ? letter : name;
  label = label.replace(/\\/g, '\\\\').toUpperCase();

  result = templateItemShift.replace(/{{KEY_CODE}}/g, name);
  jsonContent.push(result);

  result = templateItem.replace(/{{KEY_CODE}}/g, name);
  jsonContent.push(result);
}

jsonContent = templateItems.replace(/{{ITEMS}}/g, jsonContent.join(",\n")).replace(/\t/g, '  ');

console.log(jsonContent);