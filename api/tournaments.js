const express = require("express");
const tournamentsRouter = express.Router();

const {
  getAllTournaments,
  createTournament,
  getTournamentById,
  updateTournament, 
  destroyTournament
} = require("../db");

const { requireUser, checkAdmin } = require("./utils");

/*GET return a list of products in the database*/
tournamentsRouter.get("/", async (req, res, next) => {
  try {
    const tournament = await getAllTournaments();
    res.send(tournament);
  } catch (error) {
    throw error;
  }
});

/*POST Create a new product*/
tournamentsRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description, organizer, association, roundType, endCount, arrowsPerEnd, maxArrowValue, maxScore, date, location } = req.body;
  try {
    if (checkAdmin) {
    const tournament = await createTournament({ name, description, organizer, association, roundType, endCount, arrowsPerEnd, maxArrowValue, maxScore, date, location });

    res.send({
      id: tournament.id,
      name, 
      description, 
      organizer, 
      association, 
      roundType, 
      endCount, 
      arrowsPerEnd, 
      maxArrowValue, 
      maxScore, 
      date, 
      location
    });
  } else {
    res.send({
      error:"AdminError",
      message: "You must be an Admin to create a tournament."
    })
  }
  } catch (error) {
    throw error;
  }
});

tournamentsRouter.get("/:tournamentId", async (req, res, next) => {
  const { tournamentId } = req.params;
  try {
    const tournament = await getTournamentById(tournamentId);
    res.send(tournament);
  } catch (error) {
    throw error;
  }
});


/*UPDATE, only admins can update */

tournamentsRouter.patch("/:tournamentId", requireUser, async (req, res, next) => {
  const { tournamentId } = req.params;
  const { name, description, organizer, association, roundType, endCount, arrowsPerEnd, maxArrowValue, maxScore, date, location } = req.body;

  const updateFields = {};

    if(name) {
        updateFields.name = name;
    }
    if(description) {
        updateFields.description = description;
    }
    if(organizer) {
        updateFields.organizer = organizer;
    }
    if(association) {
        updateFields.association = association;
    }
    if(roundType) {
        updateFields.roundType = roundType;
    }
    if(endCount) {
        updateFields.endCount = endCount;
    }
    if(arrowsPerEnd) {
        updateFields.arrowsPerEnd = arrowsPerEnd;
    }
    if(maxArrowValue) {
        updateFields.maxArrowValue = maxArrowValue;
    }
    if(maxScore) {
        updateFields.maxScore = maxScore;
    }
    if(date) {
        updateFields.date = date;
    }
    if(location) {
        updateFields.location = location;
    }

  try {
    if(checkAdmin) {
    const updatedTournament = await updateTournament({
      id: tournamentId,
      ...updateFields
    });

    res.send(updatedTournament);
  } else {
    res.send({
      error:'AdminError',
      message: 'You must be an admin to update a tournament.'
    })
  }
  } catch (error) {
    throw error;
  }
});

/*DELETE, only admins can delete a product */

tournamentsRouter.delete("/:tournamentId", requireUser, async (req, res, next) => {
  const { tournamentId } = req.params;

  try {

    if(checkAdmin) {
    const tournament = await destroyTournament(tournamentId);
    res.send(tournament);
    } else {
      res.send ({
        error:'AdminError',
        message: 'You must be an admin to delete a tournament.'
      })
    }
  } catch (error) {
    next(error);
  }
}); 

module.exports = tournamentsRouter;