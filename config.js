// config.js
function menuButtons() {
  return [
    {
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({ display_text: 'Hello', id: 'hello' })
    },
    {
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({ display_text: 'Info', id: 'info' })
    }
  ]
}

module.exports = { menuButtons }
