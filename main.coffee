{extend, applyStylesheet} = require "./util"

applyStylesheet(require "./style")

textarea = document.createElement("textarea")
document.body.appendChild(textarea)
textarea.focus()

filePath = "New File.txt"
setPath = (newPath) ->
  document.title = filePath = newPath
  self.invokeRemote "title", filePath

self =
  loadFile: (file) ->
    readFile(file)
    .then (text) ->
      setPath file.name
      textarea.value = text

  focus: ->
    textarea.focus()

readFile = (file, method="readAsText") ->
  return new Promise (resolve, reject) ->
    reader = new FileReader()

    reader.onloadend = ->
      resolve(reader.result)
    reader.onerror = reject
    reader[method](file)

# TODO: Track dirty for beforeUnload event
# TODO: Clear dirty on parent save resolution
# TODO: Prompt if overwriting when dirty

# -------------------------------------------------
# From here on down is our Whimsy.space integration
Postmaster = require("postmaster")
Postmaster({}, self)

self.invokeRemote "childLoaded"

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

document.addEventListener "keydown", (e) ->
  if e.ctrlKey
    if e.keyCode is 83 # s
      e.preventDefault()

      if e.shiftKey
        newPath = prompt "Path", filePath
        setPath(newPath) if newPath

      file = new File [textarea.value], filePath, type: "text/plain"
      self.invokeRemote "saveFile", file
