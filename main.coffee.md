Text Editor Value Widget
========================

    {applyStylesheet} = require "./util"

Create an editor, send events back to parent.

    TextEditor = require "./text"

    template = require "./editor"

    document.body.appendChild(template())

    el = document.querySelector(".editor")

    editor = TextEditor
      el: el

    applyStylesheet(require "./style")

Use the postmaster to send value to our parent, store our current value in it as well.

    updating = false
    postmaster = require("postmaster")()
    postmaster.value = (newValue) ->
      updating = true
      editor.text(newValue)
      updating = false

Setting the mode is currently our only option.

    postmaster.options = (options) ->
      log options

      {mode} = options

      if mode?
        editor.mode mode

Expose a focus method to our parent.

    postmaster.focus = ->
      editor.focus()

    editor.text.observe (newValue) ->
      unless updating
        postmaster.sendToParent
          value: newValue

    log = (data) ->
      postmaster.sendToParent
        log: data
