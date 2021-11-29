const router = require("express").Router()
const db = require("../models/workout")

router.post("/api/workouts", ({ body }, res) => {
  Workout.create(body)
  .then((dbWorkout) => {
    res.json(dbWorkout)
  })
  .catch(err => {
    res.status(400).json(err)
  });
});

router.put("/api/workouts/:id", ({ body, params }, res) => {
  Workout.findByIdAndUpdate(
      {
        _id: params.id 
      },
      {
        $push: { exercises: body}
      },
      {
        new: true
      }
    .then((dbWorkouts) => {
        console.log(dbWorkouts)
        res.json(dbWorkouts);
    }).catch(err => {
        res.json(err);
  }));
});
  
router.get("api/workouts", (req, res) => {
  Workout.aggragate([
    {
      $addFields: {
        totalTime: {
          $sum: "$exercises.time"
        }
      }
    }
  ])
  .then(dbWorkout => {
    res.json(dbWorkout)
  })
  .catch(err => {
    res.status(400).json(err)
  });
});

module.export = router;