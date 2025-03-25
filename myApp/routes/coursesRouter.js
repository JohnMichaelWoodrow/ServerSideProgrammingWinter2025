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

courseRouter.get('/', getCourses);
courseRouter.get('/id/:id', getCourseById);
courseRouter.get('/courseName/:courseName', getCoursesByName);
courseRouter.post('/', createCourse);
courseRouter.put('/:id?/:courseName?', updateCourse);
courseRouter.delete('/:id?/:courseName?', deleteCourse);

module.exports = courseRouter;
