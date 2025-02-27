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
        type: Number  
    },
    addressStreet: {
        type: String  
    },
    addressCity: {
        type: String  
    },
    addressStateProv: {
        type: String  
    },
    addressCountry: {
        type: String  
    },
    addressPostCode: {
        type: String  
    },
    phone: {
        type: String  
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    emergContactName: {
        type: String  
    },
    emergContactPhone: {
        type: String  
    },
    emergContactRel: {
        type: String  
    },
    program: {
        type: String 
    },
    startDate: {
        type: Date  
    },
    // Should be referenced by the object ID to maintain proper relationships.
    registeredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema, 'students');

