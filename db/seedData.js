const client = require('./client')
const { createUser } = require("./users");
const { createTournament } = require("./tournaments");
const { createTourScore, updateTourScore, getTourScoresByUser } = require("./tourScores");

const dropTables = async () => {
    try {
      console.log("Dropping All Tables...");
      await client.query(`
      DROP TABLE IF EXISTS prac_scores;
      DROP TABLE IF EXISTS tour_scores;
      DROP TABLE IF EXISTS tournaments;
      DROP TABLE IF EXISTS users;
    `);
  
      console.log("Finished dropping tables!");
    } catch (error) {
      console.error("Error dropping tables!");
      throw error;
    }
}

const createTables = async () => {
    try {
      console.log("Starting to build tables...");
 
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY, 
          "firstName" VARCHAR(255) NOT NULL,
          "lastName" VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) UNIQUE NOT NULL,
          "isAdmin" BOOLEAN DEFAULT false,
          division VARCHAR(255) NOT NULL,
          "ageClass" VARCHAR(255) NOT NULL,
          gender VARCHAR(255) NOT NULL
        );

        CREATE TABLE tournaments (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL, 
          description TEXT NOT NULL,
          organizer VARCHAR(255) NOT NULL,
          association VARCHAR(255) NOT NULL,
          "roundType" VARCHAR(255) NOT NULL,
          "endCount" NUMERIC NOT NULL,
          "arrowsPerEnd" NUMERIC NOT NULL,
          "maxArrowValue" NUMERIC NOT NULL,
          "maxScore" NUMERIC NOT NULL,
          date VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          level VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL
        );

        CREATE TABLE tour_scores  (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER REFERENCES users(id),
          "tournamentId" INTEGER REFERENCES tournaments(id),
          "round1Ends" JSONB,
          "round1Score" INTEGER NOT NULL DEFAULT 0,
          "round2Ends" JSONB,
          "round2Score" INTEGER NOT NULL DEFAULT 0,
          "totalScore" INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE prac_scores  (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER REFERENCES users(id),
          "roundEnds" JSONB,
          "arrowsPerEnd" NUMERIC NOT NULL,
          "maxArrowValue" NUMERIC NOT NULL,
          "roundScore" INTEGER NOT NULL DEFAULT 0,
          "roundType" VARCHAR(255) NOT NULL,
          "maxScore" NUMERIC NOT NULL,
          date DATE DEFAULT CURRENT_DATE
        );
  
      `);
  
      console.log("Finished building tables!");
    } catch (error) {
      console.error("Error building tables!");
      throw error;
    }
  };

  const createInitialUsers = async () => {
    console.log("Starting to create users...");
    try {
      const usersToCreate = [
        { 
          firstName: 'Nick', 
          lastName: 'Mullen', 
          username: 'Sprocket', 
          password: '123456789', 
          email: '25nmullen@gmail.com', 
          isAdmin: true,
          division: 'Barebow Recurve',
          ageClass: 'Adult',
          gender: 'Male'
        },
        { 
          firstName: 'Allison', 
          lastName: 'Conroy', 
          username: 'AllisonC', 
          password: '123456', 
          email:'Allison@gmail.com',
          isAdmin: false,
          division: 'Freestyle Compound',
          ageClass: 'Adult',
          gender: 'Female'
        },
        { 
          firstName: 'Aaron', 
          lastName: 'Root', 
          username: 'AaronR', 
          password: '123456', 
          email: 'Aaron@gmail.com', 
          isAdmin: true,
          division: 'Barebow Recurve',
          ageClass: 'Adult',
          gender: 'Male' 
        }
      ];
      const users = await Promise.all(usersToCreate.map(createUser));
  
      console.log("Users created:");
      console.log(users);
      console.log("Finished creating users!");
    } catch (error) {
      console.error("Error creating users!");
      throw error;
    };
  };

  const createInitialTournaments = async () => {
    console.log("Starting to create tournaments...");
    try {
      const tournamentsToCreate = [
        { 
          name: 'ASR Buckle Series #6', 
          description: 'Local Buckle Series',
          organizer: 'ASR',
          association: 'NFAA',
          roundType: 'Vegas 300',
          endCount: 10,
          arrowsPerEnd: 3,
          maxArrowValue: 10,
          maxScore: 300,
          date: 'March 14-15 2026',
          location: 'Archery School of The Rockies',
          level: 'Local',
          status: 'Upcoming'
        },
        { 
          name: 'CSAA Vegas 900', 
          description: 'State Championship',
          organizer: 'Colorado State Archery Association',
          association: 'NFAA',
          roundType: 'Vegas 450',
          endCount: 15,
          arrowsPerEnd: 3,
          maxArrowValue: 10,
          maxScore: 450,
          date: 'March 21-22 2026',
          location: 'Empty Quiver Archery & Red Rock Archery',
          level: 'State',
          status: 'In Progress'
        },
        { 
          name: 'CSAA 5 Spot 600', 
          description: 'State Championship',
          organizer: 'Colorado State Archery Association',
          association: 'NFAA',
          roundType: '5 Spot 300',
          endCount: 12,
          arrowsPerEnd: 5,
          maxArrowValue: 5,
          maxScore: 300,
          date: 'January 31st - February 1st 2026',
          location: 'Archery School of The Rockies & Red Rock Archery',
          level: 'State',
          status: 'Completed'
        }
      ];

      const tournaments = await Promise.all(tournamentsToCreate.map(createTournament));
      console.log("Tournaments created:");
      console.log(tournaments);
      console.log("Finished creating tournaments!");
    } catch (error) {
      console.error("Error creating tournaments!");
      throw error;
    };
  };

  const createInitialTourScores = async () => {
    console.log('starting to create Tournament Scores...');
    try {
      const tourScoresToCreate = [
        {
          userId: 1, 
          tournamentId: 3,
          round1Ends: {
            "end1": ['x',5,4,4,3],
            "end2": [5,5,4,4,4],
            "end3": ['x','x',5,5,4],
            "end4": ['x',5,4,4,3],
            "end5": ['x',5,4,4,4],
            "end6": [5,5,5,5,5],
            "end7": [4,4,4,4,3],
            "end8": [5,5,4,4,3],
            "end9": ['x',5,5,4,4],
            "end10": [5,5,5,4,4],
            "end11": [5,4,4,4,3],
            "end12": [5,5,4,4,4]
          },
          round1Score: 263,
          round2Ends: {
            "end1": ['x','x',5,4,4],
            "end2": ['x',5,5,5,4],
            "end3": ['x',5,5,5,4],
            "end4": [5,5,4,4,4],
            "end5": ['x',5,5,4,4],
            "end6": ['x','x','x','x',5],
            "end7": ['x',5,5,4,4],
            "end8": [5,5,5,4,4],
            "end9": ['x',5,5,5,4],
            "end10": [5,5,5,4,4],
            "end11": ['x',5,4,4,4],
            "end12": [5,5,5,5,4]
          },
          round2Score: 280,
          totalScore: 543
        },
        {
          userId: 2, 
          tournamentId: 2,
          round1Ends: {
            "end1": [10, 9, 8],
            "end2": [10, 9, 9],
            "end3": [9, 9, 9],
            "end4": [10, 9, 7],
            "end5": [10, 10, 9],
            "end6": [10, 9, 8],
            "end7": [10, 9, 9],
            "end8": [9, 9, 9],
            "end9": [10, 9, 7],
            "end10": [10, 10, 9]
          },
          round1Score: 274,
          round2Ends: {
            "end1": [10, 9, 8],
            "end2": [10, 9, 9],
            "end3": [9, 9, 9],
            "end4": [10, 9, 7],
            "end5": [10, 10, 9],
            "end6": [10, 9, 8],
            "end7": [10, 9, 9],
            "end8": [9, 9, 9],
            "end9": [10, 9, 7],
            "end10": [10, 10, 9]
          },
          round2Score: 270,
          totalScore: 544
        },
        {
          userId: 3, 
          tournamentId: 1,
          round1Ends: {
            "end1": [10, 9, 8],
            "end2": [10, 9, 9],
            "end3": [9, 9, 9],
            "end4": [10, 9, 7],
            "end5": [10, 10, 9],
            "end6": [10, 9, 8],
            "end7": [10, 9, 9],
            "end8": [9, 9, 9],
            "end9": [10, 9, 7],
            "end10": [10, 10, 9]
          },
          round1Score: 274,
          round2Ends: {
            "end1": [10, 9, 8],
            "end2": [10, 9, 9],
            "end3": [9, 9, 9],
            "end4": [10, 9, 7],
            "end5": [10, 10, 9],
            "end6": [10, 9, 8],
            "end7": [10, 9, 9],
            "end8": [9, 9, 9],
            "end9": [10, 9, 7],
            "end10": [10, 10, 9]
          },
          round2Score: 270,
          totalScore: 544
        }
      ];
        const tourScores = await Promise.all(
          tourScoresToCreate.map((tourScore) => createTourScore(tourScore))
        );
        console.log('Tournament Scores Created: ', tourScores);
        console.log('Finished creating Tournament Scores.'); 

        const scoresToUpdate = [
          {
          userId: 1,
          tournamentId: 2,
          roundNumber: 2,
          endNumber: 6,
          endScore: [8,6,5]
          }
        ];

        const updateScores = await Promise.all(
          scoresToUpdate.map((updateScore) => updateTourScore(updateScore))
        );
        console.log('Tournament Scores Updated: ', updateScores);

        const userScores = [
          {userId: 1}
        ];

        const getUserScores = await Promise.all(
          userScores.map((userScore) => getTourScoresByUser
          (userScore))
        );

        console.log('User Scores: ', getUserScores);

    } catch(error) {
      throw error;
    };
  };

  async function rebuildDB() {
    try {
      client.connect();
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialTournaments();
    } catch (error) {
      console.log("Error during rebuildDB");
      throw error;
    }
  };

  async function addDB() {
    try {
      client.connect();
      await createInitialTourScores();
    } catch (error) {
      console.log("Error during rebuildDB");
      throw error;
    }
  };
  
  module.exports = {
    rebuildDB,
    addDB
  };
