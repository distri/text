

Create an editor, send events back to parent.

    TextEditor = require "./text"

    template = require "./editor"

    document.body.appendChild(template())

    el = document.querySelector(".editor")
    
    console.log el
    
    TextEditor
      text: "Hellow"
      el: el
