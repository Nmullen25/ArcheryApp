const client = require("./client");
const bcrypt = require("bcrypt");

const createUser = async({ username, password, email, firstName, lastName, isAdmin, division, ageClass, gender }) => {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  
  try {
    const { rows: [user] } = await client.query(
      ` INSERT INTO users (username, password, email, "firstName", "lastName", "isAdmin", "division", "ageClass") 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
      `,
      [username, hashedPassword, email, firstName, lastName, isAdmin, division, ageClass, gender]
    );

    delete user.password;
    console.log('user', user);
    return user;
  } catch (error) {
    throw error;
  }
}

const getUser = async({ username, password }) => {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);

  try {
    const { rows: [user] } = await client.query(
      `SELECT * FROM users
       WHERE username = $1
      `,
      [username]
    );

    if (passwordsMatch) {
      delete user.password;
      return user;
    }
  } catch (error) {
    throw error;
  }
}

const getAllUsers = async() => {
  try {
    const { rows } = await client.query(`
      SELECT id, username, "firstName", "lastName", email, "isAdmin", division, "ageClass" FROM users;
    `);
    return rows;
  } catch (error) {
    throw error;
  };
};

const getUserById = async(id) => {
  try {
    const { rows: [user] } = await client.query(`
      SELECT * FROM users 
      WHERE id=${id}
    `);
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw error;
  }
}

const getUserByUsername = async(username) => {
  try {
    const { rows: [user] } = await client.query(
      `SELECT * FROM users
        WHERE username=$1;
      `,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

const updateUser = async ({ id, ...fields }) => {
  // const { id } = fields;
  // delete fields.id;

  if (fields.password) {
    const hashedPassword = await bcrypt.hash(fields.password, SALT_COUNT);
    fields.password = hashedPassword;
  }

  const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 2}`).join(", ");
  if (setString.length === 0) {
    return;
  }
  try {
    if (setString.length > 0) {
      const { rows: [user] } = await client.query (`
        UPDATE users
        SET ${setString}
        WHERE id=$1
        RETURNING *;
      `, [id, ...Object.values(fields)]);
      return user;
      }
    } catch (error) {
      console.error ("Problem updating user info", error);
    };
  };

  //SQL checking if an email provided when creating new account already exists

  const getUserByEmail = async (email) => {
    try {
      const { rows: [user] } = await client.query(`
        SELECT * FROM users
        WHERE email=$1
      `, [email]);
      return user;
    } catch (error) {
      console.error("Cannot get user by email", error)
    };
  };

  const destroyUser = async (id) => {
    try {
      await client.query(`
        DELETE FROM orders
        WHERE "userId" = $1;
    `, [id]);

    await client.query(`
        DELETE FROM reviews
        WHERE "userId" = $1;
    `, [id]);
    
      const { rows: [deletedUser] } = await client.query(`
        DELETE FROM users
        WHERE id=$1
      `, [id]);
      return deletedUser;
    } catch (error) {
      throw error;
    };
  };

module.exports = {
  client,
  createUser,
  getUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  getUserByEmail,
  destroyUser
}