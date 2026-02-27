const express = require("express");
const tourScoresRouter = express.Router();

const { createTourScore, updateTourScore, getTourScoresByUser, getAllScores, getScoresByTour  } = require("../db/tourScores");
const { requireUser, checkAdmin } = require("./utils");

/*GET return a list of orders in the database, need admin, how about requireAdmin function?*/
tourScoresRouter.get("/", requireUser, async (req, res, next) => {
    try {
      if (checkAdmin) {
        const tournaments = await getAllScores();
        res.send(tournaments);
      } else {
        res.send({
          error: "AdminError",
          message: "You must be an Admin to access that"
        })
      }
      
    } catch (error) {
      throw error;
    }
  });


/*POST Create a new order*/
tourScoresRouter.post("/", async (req, res, next) => {
    const { userId, tournamentId, round1Ends, round1Score, round2Ends, round2Score, totalScore } = req.body;
    try {
      if (checkAdmin) {
        const score = await createTourScore({
          userId,
          tournamentId,
          round1Ends,
          round1Score,
          round2Ends,
          round2Score,
          totalScore
        });
      
        console.log('placed score,', score);
        res.send({
          userId,
          tournamentId,
          round1Ends,
          round1Score,
          round2Ends,
          round2Score,
          totalScore,
          message: 'Score Created'
        });
      } else {
          res.send({
          error: "AdminError",
          message: "You must be an Admin to access that"
        })
      }
    } catch (error) {
      throw error;
    }
  });


tourScoresRouter.get("/tournament/:tournamentId", async (req, res, next) => {
  const { tournamentId } = req.params;
  try {
    const tournament = await getScoresByTour(tournamentId);
    console.log(tournament, "tournament from tourScoresRouter.get");
    res.send(tournament);
  } catch (error) {
    console.log(error);
  }
});


tourScoresRouter.get("/user/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const userTourScores = await getTourScoresByUser(userId);
    console.log(userTourScores, "userTourScores from tourScoresRouter.get");
    res.send(userTourScores);
  } catch (error) {
    console.log(error);
  }
});


tourScoresRouter.delete('/:orderId', async (req, res, next) => {
  try {
    console.log(req.body)
    const { id } = req.params;
    const deletedOrder = await cancelOrder(id);
    res.send({deletedOrder, message: 'Order has been deleted.'});
  } catch (error) {
    return next(error);
  };
});


tourScoresRouter.patch('/:tournamentId', async (req, res, next) => {
  const { tournamentId, user, roundNumber, endNumber, endScore } = req.params;  
  try {
    const updatedScore = await updateTourScore({ tournamentId, user, roundNumber, endNumber, endScore });
    console.log('updatedOrder', updatedScore);
    res.send({
      updatedScore,
      message: ``
    });
  } catch (error) {
    throw (error);
  };
});


module.exports = tourScoresRouter;
