{extend, applyStylesheet} = require "./util"

global.Ajax = require "./lib/ajax"

applyStylesheet(require "./style")

textarea = document.createElement("textarea")
document.body.appendChild(textarea)
textarea.focus()

filePath = "New File.txt"

msgId = 0
Postmaster = require("postmaster")
self =
  loadFile: (file) ->
    readFile(file)
    .then (text) ->
      document.title = filePath = file.name
      textarea.value = text

  focus: ->
    textarea.focus()

Postmaster({}, self)
self.invokeRemote "childLoaded"

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

# TODO: Track dirty for beforeUnload event
# TODO: Clear dirty on parent save resolution
# TODO: Full undo history?

readFile = (file, method="readAsText") ->
  return new Promise (resolve, reject) ->
    reader = new FileReader()

    reader.onloadend = ->
      resolve(reader.result)
    reader.onerror = reject
    reader[method](file)

document.addEventListener "keydown", (e) ->
  if e.ctrlKey
    if e.keyCode is 83 # s
      e.preventDefault()

      file = new File [textarea.value], filePath, type: "text/plain"
      self.invokeRemote "saveFile", file
