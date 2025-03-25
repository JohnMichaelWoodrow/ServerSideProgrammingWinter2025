const mongoose = require('mongoose');
const Student = require('../models/studentModel');
const Course = require('../models/coursesModel');

// GET all students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({}).populate({ path: 'registeredCourses', select: 'courseName -_id' });
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET student by ID or schoolId
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('registeredCourses');
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getStudentBySchoolId = async (req, res) => {
    try {
        const student = await Student.findOne({ schoolId: req.params.schoolId }).populate('registeredCourses');
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST create a new student (single or bulk insert)
const createStudent = async (req, res) => {
    try {
        console.log("Received student data:", req.body); 

        if (Array.isArray(req.body)) {
            // Handle bulk insert
            const newStudents = await Student.insertMany(req.body);
            return res.status(201).json({ message: "Bulk insert successful", data: newStudents });
        } else {
            // Handle single insert
            const newStudent = new Student(req.body);
            await newStudent.save();
            return res.status(201).json({ message: "Student created successfully", data: newStudent });
        }
    } catch (err) {
        console.error("Error inserting student:", err.message);
        res.status(400).json({ message: err.message });
    }
};

// PUT update student by either ObjectId or schoolId
const updateStudent = async (req, res) => {
    try {
        const { id, schoolId } = req.params;
        
        let filter;
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            filter = { _id: id };
        } else if (schoolId) {
            filter = { schoolId: Number(schoolId) };
        } else {
            return res.status(400).json({ message: "Invalid ID or School ID" });
        }

        const student = await Student.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });

        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE student by ObjectId or schoolId
const deleteStudent = async (req, res) => {
    try {
        const { id, schoolId } = req.params;
        
        let student;
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            student = await Student.findByIdAndDelete(id);
        } else if (schoolId) {
            student = await Student.findOneAndDelete({ schoolId: Number(schoolId) });
        } else {
            return res.status(400).json({ message: "Invalid ID or School ID" });
        }

        if (!student) return res.status(404).json({ message: "Student not found" });

        // Also remove any enrolled courses
        await Course.updateMany(
            { enrolledStudents: student._id },
            { $pull: { enrolledStudents: student._id } }
        );

        return res.status(200).json({ message: `Student ${student.firstName} ${student.lastName} deleted` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST register a student or students to courses
const registerStudentForCourse = async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            let results = [];

            for (const reg of req.body) {
                const { schoolId, courseName } = reg;
                
                const student = await Student.findOne({ schoolId }).populate('registeredCourses');
                if (!student) {
                    results.push({ schoolId, courseName, status: `Student with schoolId ${schoolId} not found` });
                    continue;
                }
                
                const course = await Course.findOne({ courseName });
                if (!course) {
                    results.push({ schoolId, courseName, status: `Course ${courseName} not found` });
                    continue;
                }
                
                // Check for schedule conflicts
                let conflict = false;
                for (const registeredCourse of student.registeredCourses) {
                    for (const session of registeredCourse.sessions) {
                        for (const newSession of course.sessions) {
                            if (session.day === newSession.day) {
                                const endCurrent = session.startTime + session.duration;
                                const endNew = newSession.startTime + newSession.duration;
                                if (!(endCurrent <= newSession.startTime || session.startTime >= endNew)) {
                                    conflict = true;
                                    break;
                                }
                            }
                        }
                        if (conflict) break;
                    }
                    if (conflict) break;
                }
                
                if (conflict) {
                    results.push({ schoolId, courseName, status: "Schedule conflict detected!" });
                    continue;
                }
                
                // Register student for the course
                student.registeredCourses.push(course._id);
                course.enrolledStudents.push(student._id);
                await student.save();
                await course.save();
                results.push({ schoolId, courseName, status: "Registration successful" });
            }
            return res.status(200).json(results);
        } else {
            // Handle single registration
            const { schoolId, courseName } = req.body;
            
            const student = await Student.findOne({ schoolId }).populate('registeredCourses');
            if (!student) {
                return res.status(404).json({ message: `Student with schoolId ${schoolId} not found` });
            }

            const course = await Course.findOne({ courseName });
            if (!course) {
                return res.status(404).json({ message: `Course ${courseName} not found` });
            }

            // Check for schedule conflicts
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

            // Register student for the course
            student.registeredCourses.push(course._id);
            course.enrolledStudents.push(student._id);
            await student.save();
            await course.save();
            
            return res.status(200).json({ message: 'Registration successful' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE unregister students from courses (bulk or single)
const unregisterStudentsFromCourses = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Invalid format. Expected an array." });
        }

        let results = [];
        for (const reg of req.body) {
            const { schoolId, courseName } = reg;

            const student = await Student.findOne({ schoolId });
            if (!student) {
                results.push({ schoolId, courseName, status: `Student with schoolId ${schoolId} not found` });
                continue;
            }

            const course = await Course.findOne({ courseName });
            if (!course) {
                results.push({ schoolId, courseName, status: `Course ${courseName} not found` });
                continue;
            }

            student.registeredCourses = student.registeredCourses.filter(
                (courseId) => !courseId.equals(course._id)
            );

            course.enrolledStudents = course.enrolledStudents.filter(
                (studentId) => !studentId.equals(student._id)
            );

            await student.save();
            await course.save();

            results.push({ schoolId, courseName, status: "Unregistered successfully" });
        }

        return res.status(200).json(results);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getStudents,
    getStudentById,
    getStudentBySchoolId,
    createStudent,
    updateStudent,
    deleteStudent,
    registerStudentForCourse,
    unregisterStudentsFromCourses
};
