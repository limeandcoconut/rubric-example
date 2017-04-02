const express = require('express');
const path = require('path');
const app = express();

app.set('views', 'public/');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/node_modules', express.static('node_modules'));

app.get('/', function(request, response) {
    response.render('index.ejs', {title: 'Rubric.js Demo'});
});

app.listen(4341, function() {
    console.log('Listening on port 4341');
});
