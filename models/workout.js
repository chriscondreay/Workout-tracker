const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    type: String,
    name: String,
    duration: Number,
    weight: Number,
    reps: Number,
    sets: Number,
    distance: Number
});

const workoutSchema = new Schema({
    exercises: [exerciseSchema],
    day: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true }
});

// Add virtual for totalDuration
workoutSchema.virtual('totalDuration').get(function() {
    return this.exercises.reduce((total, exercise) => {
        return total + (exercise.duration || 0);
    }, 0);
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;