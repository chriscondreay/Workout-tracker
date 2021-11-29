const mongoose = require("mongoose")

const Schema = mongoose.Schema

const workoutSchema = new Schema({
    exercise_type: {
      type: String,
      trim: true,
      required: "Enter the type of exercise"
    },
    exercise_name: {
      type: String,
      trim: true,
      required: "Enter the name of your exercise"
    },
    weight: {
      type: Number,
      required: "Enter weight"
    },
    sets: {
      type: Number,
      required: "Enter number of sets"
    },
    reps: {
      type: Number,
      required: "Enter number of reps"
    },
    duration: {
      type: Number,
      required: "Enter the time duration"
    }
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;