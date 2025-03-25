const express = require('express');
const {
    getStudents,
    getStudentById,
    getStudentBySchoolId,
    createStudent,
    updateStudent,
    deleteStudent,
    registerStudentForCourse,
    unregisterStudentsFromCourses
} = require('../controllers/studentsController');

const studentRouter = express.Router();

// Define routes
studentRouter.get('/', getStudents);
studentRouter.get('/id/:id', getStudentById);
studentRouter.get('/schoolId/:schoolId', getStudentBySchoolId);
studentRouter.post('/', createStudent);
studentRouter.put('/:id?/:schoolId?', updateStudent);
studentRouter.delete('/:id?/:schoolId?', deleteStudent);
studentRouter.post('/register', registerStudentForCourse);
studentRouter.delete('/register', unregisterStudentsFromCourses);

module.exports = studentRouter;
