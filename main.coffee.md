Text Editor Value Widget
========================

    {applyStylesheet} = require "./util"

Create an editor, send events back to parent.

    TextEditor = require "./text"

    template = require "./editor"

    document.body.appendChild(template())

    el = document.querySelector(".editor")
    
    console.log el
    
    editor = TextEditor
      text: "Hellow"
      el: el

    applyStylesheet(require "./style")

Use the postmaster to send value to our parent, store our current value in it as well.

    postmaster = require("postmaster")()
    postmaster.value = editor.text

    postmaster.value.observe (newValue) ->
      postmaster.sendToParent
        value: newValue
