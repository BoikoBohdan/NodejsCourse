const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const app = express();

const apiRoutes = require('./routes')

app.use(cors())
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));


// API routes
app.use('/api', apiRoutes)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/', function(req, res){
  res.status(404).send('No such route!');
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
