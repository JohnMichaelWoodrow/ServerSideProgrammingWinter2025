const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    schoolId: {
        type: Number,
        required: [true, "School ID is required"],
        unique: true
    },
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    dob: {
        type: Date,
        required: [true, "Date of birth is required"]
    },
    addressUnit: {
        String
    },
    addressStreet: {
        String
    },
    addressCity: {
    String
    },
    addressStateProv: {
        String
    },
    addressCountry: {
        String
    },
    addressPostCode: {
        String
    },
    phone: {
        String
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    emergContactName: {
    String
    },
    emergContactPhone: {
        String
    },
    emergContactRel: {
        String
    },
    program: {
        String
    },
    registeredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema, 'students');
