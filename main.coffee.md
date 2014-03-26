Text Editor Value Widget
========================

    {applyStylesheet} = require "./util"

Create an editor, send events back to parent.

    TextEditor = require "./text"

    template = require "./editor"

    document.body.appendChild(template())

    el = document.querySelector(".editor")

    editor = TextEditor
      text: "Hellow"
      el: el

    applyStylesheet(require "./style")

Use the postmaster to send value to our parent, store our current value in it as well.

    updating = false
    postmaster = require("postmaster")()
    postmaster.value = (newValue) ->
      updating = true
      editor.text(newValue)
      updating = false

    editor.text.observe (newValue) ->
      unless updating
        postmaster.sendToParent
          value: newValue
