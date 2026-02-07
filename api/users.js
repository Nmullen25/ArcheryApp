const express = require("express");
const usersRouter = express.Router();
const { JWT_SECRET = 'neverTell' } = process.env;

const {
  createUser,
  getUser,
  getUserByUsername,
  getUserById,
  updateUser,
  getAllUsers,
  getUserByEmail,
  destroyUser
} = require("../db/users");

const jwt = require("jsonwebtoken");
const { requireUser, checkAdmin } = require("./utils");
const { getOrdersByUser } = require("../db/orders");

usersRouter.get('/', requireUser, async (req, res, next) => {
  try {
    if (checkAdmin) {
      const allUsers = await getAllUsers();
      console.log('allUsers', allUsers);
      res.send(allUsers);
    }
  } catch (error) {
    throw error;
  }
})

usersRouter.post("/register", async (req, res, next) => {
  const { username, password, email, firstName, lastName, division, ageClass, gender } = req.body;
  console.log(req.body);
  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({ message: "A user by that username already exists." });
    } else if (password.length < 8) {
      next({ message: "Password must be longer at least 8 characters long." });
    } else {
      const newUser = await createUser({
        username,
        password,
        email,
        firstName,
        lastName,
        division,
        ageClass,
        gender
      });
      console.log('newuser', newUser);
      const token = jwt.sign(
        {
          id: newUser.id,
          username: newUser.username,
        },
        JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        user: newUser,
        token,
        message: "Thank you for signing up.",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({ message: "Please enter a username and password" });
  }

  try {
    const user = await getUser({ username, password });
    if (user) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET
      );

      res.send({ user, message: "You're logged in!", token });
    } else {
      next({ message: "Username or password is incorrect." });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    console.log('error', error);
    throw error;
  }
});

usersRouter.get("/:username", async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await getUserByUsername(username);
    res.send(user);
  } catch (error) {
    throw error;
  }
});

usersRouter.patch('/:userId', requireUser, async (req, res, next) => {
  try {
    const { firstName, lastName, email, username, isAdmin } = req.body;
    const { userId } = req.params;
    const _user = await getUserById(userId);
    const _userEmail = await getUserByEmail(_user.email);
    const updateFields = {};

    if (firstName) {
      updateFields.firstName = firstName;
    }

    if (lastName) {
      updateFields.lastName = lastName;
    }

    if (username) {
      if (_user.username) {
        throw {
          name: 'AlreadyExistsError',
          message: 'Username taken, try again',
        };
      } else {
        updateFields.username = username;
      }
    }
 
        if (email) {
          if (!email.includes("@")) {
            throw {
              name: "InvalidEmailError",
              message: "Invalid email provided",
            };
          } else if (_userEmail) {
            throw {
              name: "EmailAlreadyExistsError",
              message: "That email is already in use",
            };
          } else {
            updateFields.email = email;
          }
      }

      if (isAdmin && checkAdmin) {
        updateFields.isAdmin = isAdmin;
      }
      
      const updatedUser = await updateUser({id:userId, ...updateFields});
      delete updatedUser.password;
      console.log('updatedUser...', updatedUser);
      res.send({ updatedUser, message: "User updated successfully"});
    } catch (error) {
      next (error);
    }
});

usersRouter.get('/:userId/orders', requireUser, async (req, res, next) => {
  const { userId } = req.params;
  const _user = req.user
  try {
    const user = await getUserById(userId);
    console.log('_user', _user);
    if ((_user.isAdmin === true) || (_user.id === user.id)) {
      const orders = await getOrdersByUser(user.id);
      console.log('orders172', orders);
      res.send(orders);
    } else {
      res.send({
        error: "AdminError",
        message: "You must be an Admin to access that"
      })
    }
    
  } catch (error) {
    console.log(error);
    throw error;
  }
});

usersRouter.delete('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  try {
    const userToDelete = await destroyUser(userId);
    console.log('userToDelete', userToDelete);
    res.send({
      userToDelete,
      message: "User deleted successfully"
    });
  } catch (error) {
    throw error;
  };
});

module.exports = usersRouter;