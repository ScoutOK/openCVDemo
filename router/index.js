const express = require('express');

router = express();

router.use('/', (req, res, next) => {
  console.log('hey, well, made it here!')
  res.send('YOOOOOOOOOO, this might take a while')
  next()
})

router.get('/index', (req, res, next) => {
  console.log('on the right track')
})


module.exports = router
