const express = require("express");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://workout-tracker-d4f93.web.app",     // your Firebase Hosting (if used)
    "https://workout-tracker-gaup.onrender.com" // if serving the frontend from Render too
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET","POST","PUT","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"]
}));

app.options("*", cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB connection error:", err));


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
    Workout.find({})
        .then((workoutData) => {
            res.json(workoutData);
        })
        .catch(err => {
            console.error('Error fetching workouts:', err);
            res.status(400).json(err);
        });
});

app.get("/api/workouts/range", (req, res) => {
    Workout.find({})
        .sort({ day: -1 })
        .limit(7)
        .then((workoutData) => {
            res.json(workoutData);
        })
        .catch(err => {
            console.error('Error fetching workout range:', err);
            res.status(400).json(err);
        });
});

app.put("/api/workouts/:id", (req, res) => {
  Workout.updateOne(
    {
      _id: req.params.id
    },
    {
      $push: { 
        exercises: req.body 
      }
    })
    .then((workoutData) => {
      res.json(workoutData);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

app.post('/api/workouts', (req, res) => {
  Workout.create(req.body)
    .then((workoutData) => {
      res.json(workoutData);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
});

app.listen(PORT, () => {
  console.log(`App is running on localhost: ${PORT}`)
})