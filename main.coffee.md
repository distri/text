Text Editor Value Widget
========================

    {applyStylesheet, applyStylesheetLink} = require "./util"

Create an editor, send events back to parent.

    TextEditor = require "./text"

    template = require "./editor"

    document.body.appendChild(template())

    el = document.querySelector(".editor")

    editor = TextEditor
      el: el

    # TODO: Should add this as a resource is pixie.cson or elsewhere so we can
    # cache it for offline
    applyStylesheetLink("https://cdn.firebase.com/libs/firepad/1.1.0/firepad.css")
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

      {mode, firebase} = options

      if mode?
        editor.mode mode

      if firebase?
        editor.initFirebase firebase...

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