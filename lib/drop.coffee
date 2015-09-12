module.exports = (element, handler) ->
  cancel = (e) ->
    e.preventDefault()

    return false

  element.addEventListener "dragover", cancel
  element.addEventListener "dragenter", cancel
  element.addEventListener "drop", (e) ->
    e.preventDefault()

    # Only handle Whimsy File Drops
    data = e.dataTransfer.getData('application/whimsy-file')
    if data
      handler JSON.parse(data)

    return false
