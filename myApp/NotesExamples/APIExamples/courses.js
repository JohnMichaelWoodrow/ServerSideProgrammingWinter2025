// const express = require('express')
// const mongoose = require('mongoose')
// const Course = require('./models/coursesModel.js');
// const cors = require('cors');
// const app = express()
// app.use(cors());
// app.use(express.json());
// const port = 3000
// mongoURI = 'mongodb://Student22:Student22@logan';

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.post('/api/courses', async (req, res) => {
//   try {
//     const sched = await Course.create(req.body);
//     res.status(200).json(sched);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// })

// const start = async () => {
//   try {
//     await mongoose.connect(mongoURI, {dbname: 'home22'});
//     console.log("Connected to the database!");
//     app.listen(port, () => {
//       console.log(`Example app listening on port ${port}`);
//     });
//   } catch (error) {
//     console.log("Failed to connect to the database.");
//   }
// }

// start();
//////////////////////////////////////////////////////////////////////////////////////
const mongoose = require ('mongoose');



const express = require('express')



 const courseRoute = require ('./routes/coursesRoute');

// const studentRoute = require ('C:/Users/Jason/myapp/routes/student.route');



const app = express()

const port = 3000



const cors = require('cors');

app.use(cors());



app.use(express.json());



app.use('/api/courses', courseRoute);

// app.use('/api/students', studentRoute);



 mongoose.connect('mongodb://Student22:Student22@logan', { dbName: 'home22' })

  .then(() => {

       console.log("Connected to the database!");

            app.listen(port, () => {

                     console.log(`Example app listening on port ${port}`);

                          });

                           })

                            .catch(() => {

                                 console.log("Failed to connect to the database.");

                                  });