{extend, applyStylesheet} = require "./util"

applyStylesheet(require "./style")

textarea = document.createElement("textarea")
document.body.appendChild(textarea)
textarea.focus()

msgId = 0
postmaster = require("postmaster")()
extend postmaster,
  load: (newValue) ->
    textarea.value = newValue

  focus: ->
    textarea.focus()

  invokeParent: (method, params...) ->
    id = msgId
    msgId += 1

    postmaster.sendToParent
      id: id
      method: method
      params: params

# Handle File Drops
dropReader = require "./lib/drop"

dropReader document, (data) ->
  postmaster.invokeParent "title", data.path
  textarea.value = data.content

# TODO: Track dirty for beforeUnload event
# TODO: Clear dirty on parent save resolution

document.addEventListener "keydown", (e) ->
  if e.ctrlKey
    if e.keyCode is 83 # s
      e.preventDefault()

      postmaster.invokeParent "save", textarea.value
