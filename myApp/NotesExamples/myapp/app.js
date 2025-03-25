const express = require('express')

const app = express()

const port = 3000



// app.get('/', (req, res) => {

//   res.send('Hello World!')

//   })



//   app.listen(port, () => {

//     console.log(`Example app listening on port ${port}`)

//     })
//})c
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.post('/api/courses', async (req, res) => {
  // The browser uses the GET method to send any message, so 
  // use postman to send a POST message to the app.
  try{
    // Here we'll use our model to save the data.
    // we expect req.body will contain a course record to save to the db.
    const sched = await Course.create(req.body);
    res.status(200).json(sched);
  }
  catch (error) {
    res.status(500).json({ message: error.message});
  }
}); 