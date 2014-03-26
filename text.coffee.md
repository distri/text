Text
====

    {extend, defaults} = require "./util"
    Observable = require "observable"

`Text` is a model for editing a text file. Currently it uses the Ace
editor, but we may switch in the future. All the editor specific things live in
here.

    module.exports = (I) ->
      defaults I,
        mode: "coffee"
        text: ""

      self =
        text: Observable I.text

We can't use ace on a div not in the DOM so we need to be sure to pass one in.

      el = I.el

Here we create and configure the Ace text editor.

TODO: Load these options from a preferences somewhere.

      editor = ace.edit(el)
      editor.setFontSize("16px")
      editor.setTheme("ace/theme/chrome")
      editor.getSession().setUseWorker(false)
      editor.getSession().setMode("ace/mode/#{I.mode}")
      editor.getSession().setUseSoftTabs(true)
      editor.getSession().setTabSize(2)

`reset` Sets the content of the editor to the given content and also resets any
cursor position or selection.

      reset = (content="") ->
        editor.setValue(content)
        editor.moveCursorTo(0, 0)
        editor.session.selection.clearSelection()

      reset(I.text)

We modify our text by listening to change events from Ace.

TODO: Remove these `updating` hacks.

      updating = false
      editor.getSession().on 'change', ->
        updating = true
        self.text(editor.getValue())
        updating = false

We also observe any changes to `text` ourselves to stay up to date with outside
modifications. Its a bi-directional binding.

      self.text.observe (newValue) ->
        unless updating
          reset(newValue)

We expose some properties and methods.

      extend self,
        el: el
        editor: editor
        reset: reset
        focus: ->
          editor.focus()

          return
        mode: (mode) ->
          editor.getSession().setMode("ace/mode/#{mode}")

          return

      return self
