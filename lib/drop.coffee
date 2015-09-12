module.exports = (element, handler) ->
  cancel = (e) ->
    console.log "CANCEL:", e
    e.preventDefault()

    return false

  element.addEventListener "dragover", cancel
  element.addEventListener "dragenter", cancel
  element.addEventListener "drop", (e) ->
    e.preventDefault()

    global.dataTransfer = e.dataTransfer
    console.log e.dataTransfer.getData("text/html")

    # Only handle Whimsy File Drops
    data = e.dataTransfer.getData('application/whimsy-file')
    if data
      handler JSON.parse(data)

    return false
