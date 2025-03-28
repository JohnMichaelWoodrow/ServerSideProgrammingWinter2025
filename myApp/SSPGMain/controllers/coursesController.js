const Courses = require('../models/coursesModel');

// GET all courses
const getCourses = async (req, res) => {
    try {
        const courses = await Courses.find({});
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET course by ID
const getCourseById = async (req, res) => {
    try {
        const course = await Courses.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET courses by name
const getCoursesByName = async (req, res) => {
    try {
        const courses = await Courses.find({ name: req.params.name });
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST create a new course
const createCourse = async (req, res) => {
    try {
        const newCourse = new Courses(req.body);
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT update a course by ID
const updateCourse = async (req, res) => {
    try {
        const updatedCourse = await Courses.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(updatedCourse);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE a course by ID
const deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await Courses.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(deletedCourse);
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
