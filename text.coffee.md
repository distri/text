Text
====

    {defaults} = require "./util"

`Text` is a model for editing a text file. Currently it uses the Ace
editor, but we may switch in the future. All the editor specific things live in
here.

    module.exports = (I) ->
      defaults I,
        mode: "coffee"
        text: ""

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
        console.log "resetting", content
        editor.setValue(content)
        editor.moveCursorTo(0, 0)
        editor.session.selection.clearSelection()

We expose some properties and methods.

      self =
        el: el
        editor: editor
        reset: reset
        focus: ->
          editor.focus()

          return
        mode: (mode) ->
          editor.getSession().setMode("ace/mode/#{mode}")

          return

To initialize Firepad we need a unique path for the file i.e. repo/branch/file.
We also need a firebase url.

        initFirebase: (firebaseURL, path) ->
          ref = new Firebase(firebaseURL).child(path)
          defaultText = editor.getValue()
          self.reset()
          Firepad.fromACE ref, editor,
            defaultText: defaultText

      self.reset(I.text)

      return self
