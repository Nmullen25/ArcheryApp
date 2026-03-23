const express = require("express");
const pracScoresRouter = express.Router();

const { createPracRound, updatePracScore, getPracScoresByUser } = require("../db/pracScores");
const { requireUser } = require("./utils");


/*POST Create a new order*/
pracScoresRouter.post("/", async (req, res, next) => {
    const { userId, roundType } = req.body;
    const roundScore = 0;
    let arrowsPerEnd = 0;
    let maxArrowValue = 0;
    let maxScore = 0;
    let roundEnds = null;

    if (roundType === 'Vegas 300') {
        roundEnds = {
          1: [], 2: [], 3: [], 4: [], 5: [],
          6: [], 7: [], 8: [], 9: [], 10: []
        };
        arrowsPerEnd = 3;
        maxArrowValue = 10;
        maxScore = 300;
    } else if (roundType === 'Vegas 450') {
        roundEnds = {
          "end1": [], "end2": [], "end3": [], "end4": [], "end5": [],
          "end6": [], "end7": [], "end8": [], "end9": [], "end10": [],
          "end11": [], "end12": [], "end13": [], "end14": [], "end15": []
        };
        arrowsPerEnd = 3;
        maxArrowValue = 10;
        maxScore = 450;
    } else if (roundType === 'NFAA 300') {
        roundEnds = {
          "end1": [], "end2": [], "end3": [], "end4": [], "end5": [],
          "end6": [], "end7": [], "end8": [], "end9": [], "end10": [],
          "end11": [], "end12": []
        };
        arrowsPerEnd = 5;
        maxArrowValue = 5;
        maxScore = 300;
    };

    try {
      if (requireUser) {
        const pracRound = await createPracRound({
          userId,
          roundEnds,
          arrowsPerEnd,
          maxArrowValue,
          roundScore,
          roundType,
          maxScore
        });
      
        console.log('Created Practice,', pracRound);
        res.send({
          userId,
          message: 'Practice Created',
          id: pracRound.id
        });
      } else {
          res.send({
          error: "UserError",
          message: "You must be a User to do that"
        })
      }
    } catch (error) {
      throw error;
    }
  });

pracScoresRouter.get("/user/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const userPracScores = await getPracScoresByUser(userId);
    console.log(userPracScores, "userPracScores from pracScoresRouter.get");
    res.send(userPracScores);
  } catch (error) {
    console.log(error);
  }
});


pracScoresRouter.delete('/:pracScoreId', async (req, res, next) => {
  try {
    console.log(req.body)
    const { id } = req.params;
    const deletedOrder = await cancelOrder(id);
    res.send({deletedOrder, message: 'Order has been deleted.'});
  } catch (error) {
    return next(error);
  };
});


pracScoresRouter.patch('/:pracScoreId', async (req, res, next) => {
  const { user, pracScoreId, endNumber, endScore } = req.params;  
  try {
    const updatedScore = await updatePracScore({ user, pracScoreId, endNumber, endScore });
    console.log('updatedOrder', updatedScore);
    res.send({
      updatedScore,
      message: ``
    });
  } catch (error) {
    throw (error);
  };
});


module.exports = pracScoresRouter;
