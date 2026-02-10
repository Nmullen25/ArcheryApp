const client = require('./client')
const { createUser } = require("./users");

const dropTables = async () => {
    try {
      console.log("Dropping All Tables...");
      await client.query(`
      DROP TABLE IF EXISTS order_products;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS products;
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

  async function rebuildDB() {
    try {
      client.connect();
      await dropTables();
      await createTables();
      await createInitialUsers();
    } catch (error) {
      console.log("Error during rebuildDB");
      throw error;
    }
  }
  
  module.exports = {
    rebuildDB,
    createInitialUsers,
  };
