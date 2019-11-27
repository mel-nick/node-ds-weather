if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY
  const axios = require('axios')
  const express = require('express')
  const app = express()
  const PORT = process.env.PORT || 3000
  
  app.use(express.json())
  app.use(express.static('public'))
 
  app.post('/weather', (req, res) => {
    const url = `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${req.body.latitude},${req.body.longitude}?units=si`
    axios({
      url: url,
      responseType: 'json'
    })
    .then(data => res.json(data.data))
    // .then(data => console.log(data))
    .catch(error=>console.error(error))

  })
   
  app.listen(PORT, () => {
    console.log(`Server Started on port: ${PORT}`)
  })