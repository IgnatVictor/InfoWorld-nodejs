const express = require('express');
const app = express();
const port = 9999;



app.use(express.json());
app.use(express.urlencoded());

// Import routes

const medic = require('./routes/medic.route');

app.use('/', medic);

app.listen(port, () => {
  console.log(`server listening on port : ${port}!`);
});
