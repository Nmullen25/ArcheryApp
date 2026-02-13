const client = require('./client')
const { createUser } = require("./users");
const { createTournament } = require("./tournaments");

const dropTables = async () => {
    try {
      console.log("Dropping All Tables...");
      await client.query(`
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
          location VARCHAR(255) NOT NULL
        );
  
      `);
  
      console.log("Finished building tables!");
    } catch (error) {
      console.error("Error building tables!");
      throw error;
    }
  }

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
          division: 'Bareboe Recurve',
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
          location: 'Archery School of The Rockies'
        },
        { 
          name: 'CSAA Vegas 900', 
          description: 'State Championship, Round 1 of 2',
          organizer: 'Colorado State Archery Association',
          association: 'NFAA',
          roundType: 'Vegas 450',
          endCount: 15,
          arrowsPerEnd: 3,
          maxArrowValue: 10,
          maxScore: 450,
          date: 'March 21-22 2026',
          location: 'Empty Quiver Archery & Red Rock Archery'
        },
        { 
          name: 'CSAA 5 Spot 600', 
          description: 'State Championship, Round 1 of 2',
          organizer: 'Colorado State Archery Association',
          association: 'NFAA',
          roundType: '5 Spot 300',
          endCount: 12,
          arrowsPerEnd: 5,
          maxArrowValue: 5,
          maxScore: 300,
          date: 'January 31st - February 1st 2026',
          location: 'Archery School of The Rockies & Red Rock Archery' 
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
  }
  
  module.exports = {
    rebuildDB,
  };
