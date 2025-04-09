const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const battleshipRoutes = require('./routes/battleshipRouter');

// Serve static UI
app.use(express.static(path.join(__dirname, 'public')));

// Battleship API
app.use('/battleship', battleshipRoutes);

app.listen(port, () => {
  console.log(`Battleship server at http://localhost:${port}/battleship`);
  console.log(`Test UI at       http://localhost:${port}/`);
});
