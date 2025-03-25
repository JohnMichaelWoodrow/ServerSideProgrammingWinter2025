const Courses = require('../models/coursesModel.js');

const getCourses = async (req, res) => {
    try {
        const courses = await Courses.find ({});
        res.status(200).json(courses);
    }
    catch (err) {
        res.status(500).json({ message: err.message});
    }
}



module.exports={
    getCourses
};