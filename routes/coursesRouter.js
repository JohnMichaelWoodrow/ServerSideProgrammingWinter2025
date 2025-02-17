const express = require('express');
const {
    getCourses,
    getCourseById,
    getCoursesByName,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/coursesController');

const courseRouter = express.Router();

// Define routes
courseRouter.get('/', getCourses);                  
courseRouter.get('/id=:id', getCourseById);         
courseRouter.get('/name=:name', getCoursesByName);   
courseRouter.post('/', createCourse);               
courseRouter.put('/id=:id', updateCourse);           
courseRouter.delete('/id=:id', deleteCourse);         

module.exports = courseRouter;
