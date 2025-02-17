const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const courseRoute = require('./routes/coursesRouter');
const studentRouter = require('./routes/studentsRouter');

const app = express();
const port = 3000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes setup
app.use('/api/courses', courseRoute);
app.use('/api/students', studentRouter);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017', { dbName: 'courses', useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to the local MongoDB database!");
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database.", err);
    });
