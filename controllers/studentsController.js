const Student = require('../models/studentModel');
const Course = require('../models/coursesModel');

// GET all students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET student by ID
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST create a new student
const createStudent = async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT update a student by ID
const updateStudent = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(updatedStudent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE a student by ID
const deleteStudent = async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(deletedStudent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//  Register a student to a course
const registerStudentForCourse = async (req, res) => {
    const { studentId, courseId } = req.body;

    try {
        const student = await Student.findById(studentId).populate('registeredCourses');
        const course = await Course.findById(courseId);

        for (const registeredCourse of student.registeredCourses) {
            for (const session of registeredCourse.sessions) {
                for (const newSession of course.sessions) {
                    if (session.day === newSession.day) {
                        const endCurrent = session.startTime + session.duration;
                        const endNew = newSession.startTime + newSession.duration;
                        if (!(endCurrent <= newSession.startTime || session.startTime >= endNew)) {
                            return res.status(400).json({ message: 'Schedule conflict detected!' });
                        }
                    }
                }
            }
        }

        student.registeredCourses.push(courseId);
        course.enrolledStudents.push(studentId);

        await student.save();
        await course.save();

        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    registerStudentForCourse
};
