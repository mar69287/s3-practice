const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
require('dotenv').config()
require('./config/database')
const multer = require('multer');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

// const storage = multer.memoryStorage()
// const upload = multer({ storage });
// app.post('/api/upload', upload.single('image'), (req, res) => {
//   // if (req.file) {
//   //   const filePath = path.join('assets', req.file.filename);
//   //   console.log('File uploaded:', filePath);
//   //   res.json({ filePath });
//   // } else {
//   //   res.status(400).json({ message: 'File upload failed' });
//   // }
//   console.log(req.file)
// });

app.use(require('./config/checkToken'))


// Put API routes here, before the "catch all" route
app.use('/api/users', require('./routes/api/users'))
app.use('/api/images', require('./routes/api/images'))
app.use('/api/profiles', require('./routes/api/profiles'))
// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX requests
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log(`Express app running on port ${port}`)
});
