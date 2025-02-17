const mongoose = require('mongoose');

const SessionSubSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    startTime: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    room: {
        type: String,
        required: true
    }
});

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the course name"]
    },
    courseTitle: {
        type: String,
        required: [true, "Please enter the course title"]
    },
    sessions: {
        type: [SessionSubSchema],
        default: []
    },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}, {
    timestamps: true
});

const Course = mongoose.model('Course', CourseSchema, 'courses');
module.exports = Course;

