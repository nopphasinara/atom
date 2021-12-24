# You can add the following to your init.coffee to send Ctrl+@ when you press Ctrl+Alt+G:

# atom.keymaps.addKeystrokeResolver ({event}) ->
#   if event.code is 'KeyG' and event.altKey and event.ctrlKey and event.type isnt 'keyup'
#     return 'ctrl-@'