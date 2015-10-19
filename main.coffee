{extend, applyStylesheet} = require "./util"

applyStylesheet(require "./style")

dirty = false

textarea = document.createElement("textarea")
document.body.appendChild(textarea)
textarea.focus()

textarea.oninput = ->
  dirty = true
  updateTitle()

filePath = "New File.txt"
setPath = (newPath) ->
  filePath = newPath
  updateTitle()

updateTitle = ->
  prefix = if dirty
    "*"
  else
    ""

  title = "#{prefix}#{filePath}"
  document.title = title
  self.invokeRemote "title", title

self =
  loadFile: (file) ->
    if dirty
      return unless confirm "You have unsaved changes, are you sure you want to overwrite them?"

    readFile(file)
    .then (text) ->
      textarea.value = text
      dirty = false
      setPath file.name

  save: ->
    file = new Blob [textarea.value],
      type: "text/plain"
    self.invokeRemote "saveFile", file, filePath
    .then ->
      dirty = false
      updateTitle()

  # We need to implement saveState and restoreState if we want to be able to
  # persist across popping the window in and out.
  saveState: ->
    value: textarea.value
    dirty: dirty
    filePath: filePath

  restoreState: (state) ->
    textarea.value = state.value
    dirty = state.dirty
    filePath = state.filePath
    updateTitle()

  focus: ->
    textarea.focus()

readFile = (file, method="readAsText") ->
  return new Promise (resolve, reject) ->
    reader = new FileReader()

    reader.onloadend = ->
      resolve(reader.result)
    reader.onerror = reject
    reader[method](file)

window.onbeforeunload = ->
  if dirty
    "You have unsaved changes, are you sure you want to leave?"

# -------------------------------------------------
# From here on down is our Whimsy.space integration
Postmaster = require("postmaster")
Postmaster({}, self)

# Apps must call childLoaded if they want to receive state/file data from OS
self.invokeRemote "childLoaded"

# whimsy-file may return the link to the file data as a URL so we need to be
# able to download the contents
Ajax = require "./lib/ajax"

# Handle File Drops
dropReader = require "./lib/drop"
dropReader document, (e) ->
  jsonText = e.dataTransfer.getData("application/whimsy-file+json")
  if jsonText
    fileData = JSON.parse(jsonText)

    {content, url, path, type} = fileData

    if content
      file = new File [content], path, type: type
    else if url
      Ajax.getBlob(url)
      .then (blob) ->
        blob.name = path

        self.loadFile(blob)
  else
    file = e.dataTransfer.files[0]

  if file
    self.loadFile(file)

document.addEventListener "mousedown", ->
  self.invokeRemote "focus"

document.addEventListener "keydown", (e) ->
  if e.ctrlKey
    if e.keyCode is 83 # s
      e.preventDefault()

      if e.shiftKey
        newPath = prompt "Path", filePath
        setPath(newPath) if newPath

      self.save()
