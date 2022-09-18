const express = require("express");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MOGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const Workout = require("./models/workout");

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/stats', (req, res) => {
  res.sendFile(path.join(__dirname, './public/stats.html'));
});

app.get('/exercise', (req, res) => {
  res.sendFile(path.join(__dirname, './public/exercise.html'));
});

app.get('/api/workouts', (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: "$exercise.duration"
        }
      }
    }
  ])
  .then(workoutData => {
    res.json(workoutData)
  })
  .catch(err => {
    res.status(400).json(err)
  });
});

app.post('/api/workouts', (req, res) => {
  Workout.create(req.body)
    .then(workoutData => {
      res.json(workoutData);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App is running on localhost: ${PORT}`)
})