const Student = require('../models/studentModel');
const Course = require('../models/coursesModel');

// GET all students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({})
            .populate({
                path: 'registeredCourses',
                select: 'courseName -_id' // Excludes ID field
            });
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET student by ID
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate({
                path: 'registeredCourses',
                select: 'courseName -_id'  // Excludes ID field
            });
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
        console.log("Received student data:", req.body); // Debugging log

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

// DELETE a student by schoolId or ObjectId
const deleteStudent = async (req, res) => {
    try {
        const { schoolId, id } = req.params; // Allow deletion by either schoolId or _id

        let student;
        if (schoolId) {
            student = await Student.findOneAndDelete({ schoolId: schoolId });
        } else if (id) {
            student = await Student.findByIdAndDelete(id);
        }

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Also remove student from any enrolled courses
        await Course.updateMany(
            { enrolledStudents: student._id },
            { $pull: { enrolledStudents: student._id } }
        );

        return res.status(200).json({ message: `Student ${student.firstName} ${student.lastName} deleted` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//  Register a student to a course
const registerStudentForCourse = async (req, res) => {
    try {
        // If req.body is an array, handle bulk registration
        if (Array.isArray(req.body)) {
            let results = [];
            for (const reg of req.body) {
                const { schoolId, courseName } = reg;
                
                // Find student by schoolId
                const student = await Student.findOne({ schoolId: schoolId }).populate('registeredCourses');
                if (!student) {
                    results.push({ schoolId, courseName, status: `Student with schoolId ${schoolId} not found` });
                    continue;
                }
                
                // Find course by courseName
                const course = await Course.findOne({ courseName: courseName });
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
                
                // Register student for course by pushing the object IDs
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
            const student = await Student.findOne({ schoolId: schoolId }).populate('registeredCourses');
            if (!student) {
                return res.status(404).json({ message: `Student with schoolId ${schoolId} not found` });
            }
            const course = await Course.findOne({ courseName: courseName });
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
            
            // Register student for course by pushing the object IDs
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

const unregisterStudentsFromCourses = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Invalid format. Expected an array." });
        }

        let results = [];
        for (const reg of req.body) {
            const { schoolId, courseName } = reg;

            const student = await Student.findOne({ schoolId: schoolId });
            if (!student) {
                results.push({ schoolId, courseName, status: `Student with schoolId ${schoolId} not found` });
                continue;
            }

            const course = await Course.findOne({ courseName: courseName });
            if (!course) {
                results.push({ schoolId, courseName, status: `Course ${courseName} not found` });
                continue;
            }

            // Remove course from student's registeredCourses array
            student.registeredCourses = student.registeredCourses.filter(
                (courseId) => !courseId.equals(course._id)
            );

            // Remove student from course's enrolledStudents array
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
    createStudent,
    updateStudent,
    deleteStudent,
    registerStudentForCourse,
    unregisterStudentsFromCourses
};
