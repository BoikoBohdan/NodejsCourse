const express = require('express');
const bodyParser = require('body-parser');

const apiRoutes = require('./controllers')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api', apiRoutes)

app.get('*', function(req, res){
  res.status(404).send('No such route!');
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});