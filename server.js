const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// CORS configuration
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://workout-tracker-d4f93.web.app",
    "https://workout-tracker-gaup.onrender.com"
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

// MongoDB Connection with better debugging
console.log("MongoDB Connection Debug:");
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

// Remove any potential quotes from the connection string
const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/['"]/g, '') : 'mongodb+srv://condreaychris_db_user:xx48tanL7q3SHUeu@cluster0.kcmnioq.mongodb.net/';

console.log("Attempting to connect to MongoDB...");

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
    socketTimeoutMS: 45000, // Increase socket timeout
})
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
        console.log("✅ Database:", mongoose.connection.db.databaseName);
    })
    .catch(err => {
        console.error("❌ MongoDB connection failed:");
        console.error("❌ Error:", err.message);
        console.error("❌ Connection string used:", MONGODB_URI ? "Present" : "Missing");
    });

// Connection event listeners
mongoose.connection.on('error', err => {
    console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('❌ MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
});

// Import models after connection
const Workout = require("./models/workout");

// Your routes remain the same...
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
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ error: "Database not connected" });
    }

    Workout.aggregate([
        {
            $addFields: {
                totalDuration: {
                    $sum: "$exercises.duration"  // Fixed: was "$exercise.duration"
                }
            }
        }
    ])
        .then((workoutData) => {
            res.json(workoutData)
        })
        .catch(err => {
            console.error("Error fetching workouts:", err);
            res.status(400).json(err)
        });
});

app.get("/api/workouts/range", (req, res) => {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ error: "Database not connected" });
    }

    Workout.aggregate([
        {
            $addFields: {
                totalDuration: {
                    $sum: "$exercises.duration"  // Fixed: was "$exercise.duration"
                }
            }
        }])
        .sort({ day: -1 })
        .limit(7)
        .then((workoutData) => {
            res.json(workoutData);
        })
        .catch(err => {
            console.error("Error fetching workout range:", err);
            res.status(400).json(err);
        });
});

app.put("/api/workouts/:id", (req, res) => {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ error: "Database not connected" });
    }

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
            console.error("Error updating workout:", err);
            res.status(400).json(err);
        });
});

app.post('/api/workouts', (req, res) => {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ error: "Database not connected" });
    }

    Workout.create(req.body)
        .then((workoutData) => {
            res.json(workoutData);
        })
        .catch((err) => {
            console.error("Error creating workout:", err);
            res.status(400).json(err);
        });
});

app.listen(PORT, () => {
    console.log(`App is running on port: ${PORT}`)
});