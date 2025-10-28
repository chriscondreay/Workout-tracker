// functions/index.js
const functions = require("firebase-functions");
const express = require("express");
const app = express();

app.get("/api/workouts", /* handler */);
app.get("/api/workouts/range", /* handler */);
app.post("/api/workouts", /* handler */);
app.put("/api/workouts/:id", /* handler */);

exports.api = functions.https.onRequest(app);

