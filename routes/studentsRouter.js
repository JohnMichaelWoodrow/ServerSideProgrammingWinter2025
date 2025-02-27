const express = require('express');
const {
    getStudents,
    getStudentById,
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
studentRouter.post('/', createStudent);               
studentRouter.put('/id/:id', updateStudent);          
studentRouter.delete('/id/:id', deleteStudent);
studentRouter.delete('/schoolId/:schoolId', deleteStudent);
studentRouter.post('/register', registerStudentForCourse);  // Fixed: Uses courseName instead of courseId
studentRouter.delete('/register', unregisterStudentsFromCourses);  

module.exports = studentRouter;
