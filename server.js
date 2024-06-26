const express = require('express')
const path = require('path')

const app = express()
const port = 5050

app.use(express.static(path.join(__dirname, 'build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/portfolio', 'index.html'))
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})