const mongoose = require('mongoose');
const Course = require('../models/coursesModel');
const Student = require('../models/studentModel');

// GET all courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).populate({ path: 'enrolledStudents', select: 'schoolId -_id' });
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET course by ID or courseName
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('enrolledStudents');
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getCoursesByName = async (req, res) => {
    try {
        const course = await Course.findOne({ courseName: req.params.courseName }).populate('enrolledStudents');
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST create a new course (single or bulk insert)
const createCourse = async (req, res) => {
    try {
        console.log("Received course data:", req.body);

        if (Array.isArray(req.body)) {
            // Handle bulk insert
            const newCourses = await Course.insertMany(req.body);
            return res.status(201).json({ message: "Bulk insert successful", data: newCourses });
        } else {
            // Handle single insert
            const newCourse = new Course(req.body);
            await newCourse.save();
            return res.status(201).json({ message: "Course created successfully", data: newCourse });
        }
    } catch (err) {
        console.error("Error inserting course:", err.message);
        res.status(400).json({ message: err.message });
    }
};

// PUT update course by either ObjectId or courseName
const updateCourse = async (req, res) => {
    try {
        const { id, courseName } = req.params;
        
        let filter;
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            filter = { _id: id };
        } else if (courseName) {
            filter = { courseName: courseName };
        } else {
            return res.status(400).json({ message: "Invalid ID or Course Name" });
        }

        const course = await Course.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });

        if (!course) return res.status(404).json({ message: "Course not found" });

        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE a course by ObjectId or courseName
const deleteCourse = async (req, res) => {
    try {
        const { id, courseName } = req.params;
        
        let course;
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            course = await Course.findByIdAndDelete(id);
        } else if (courseName) {
            course = await Course.findOneAndDelete({ courseName: courseName });
        } else {
            return res.status(400).json({ message: "Invalid ID or Course Name" });
        }

        if (!course) return res.status(404).json({ message: "Course not found" });

        await Student.updateMany(
            { registeredCourses: course._id },
            { $pull: { registeredCourses: course._id } }
        );

        return res.status(200).json({ message: `Course ${course.courseName} deleted` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getCourses,
    getCourseById,
    getCoursesByName,
    createCourse,
    updateCourse,
    deleteCourse
};
