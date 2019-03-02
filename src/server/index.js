const express = require('express');
const bodyParser = require('body-parser');
const { mailchimpRequest } = require('./mailchimp');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('dist'));

app.get('/api/getUsername', (req, res) => res.send({ username: 'User' }));
app.all('/api/mailchimp/*', mailchimpRequest);

app.listen(process.env.PORT || 9005, () => console.log(`Listening on port ${process.env.PORT || 9005}!`));
