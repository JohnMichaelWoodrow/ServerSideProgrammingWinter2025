const express = require('express');
const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    registerStudentForCourse
} = require('../controllers/studentsController');

const studentRouter = express.Router();

// Define routes
studentRouter.get('/', getStudents);                
studentRouter.get('/id/:id', getStudentById);        
studentRouter.post('/', createStudent);               
studentRouter.put('/id/:id', updateStudent);          
studentRouter.delete('/id/:id', deleteStudent);
studentRouter.post('/register', registerStudentForCourse);        

module.exports = studentRouter;
