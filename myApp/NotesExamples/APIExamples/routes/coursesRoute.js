const express = require("express");
const courseRouter = express.Router (); // this router will be our interface

const {getCourses//, getCourse, createCourse, updateCourse, deleteCourse

} =
  require ("../controllers/coursesController.js");

courseRouter.get ('/', getCourses);
// courseRouter.get ('/id=:id', getCourse);
// courseRouter.post ('/', createCourse);
// courseRouter.put ('/id=:id', updateCourse);
// courseRouter.delete ('/id=:id', deleteCourse);

module.exports = courseRouter;
