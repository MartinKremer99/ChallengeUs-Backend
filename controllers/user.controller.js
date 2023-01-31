/*
  Login for the users
*/

const db = require("../models");
const bcrypt = require("bcrypt");
const User = db.user;

/*
  Create a user and bcrypt the password
*/

exports.addUser = (req, res) => {
  return User.create(req.body)
    .then(async () => {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(req.body.password, salt);
      await User.update(
        { password: hash },
        {
          where: {
            email: req.body.email,
          },
        }
      ).then((user) => {
        console.log(">> Created User: " + JSON.stringify(user, null, 4));
        res.status(201);
        res.json(user);
      });
    })
    .catch((err) => {
      console.log(">> Error while creating user: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getUser = (req, res) => {
  return User.findByPk(req.params.id)
    .then((user) => {
      res.status(200);
      res.json(user);
    })
    .catch((err) => {
      console.log(">> Error while finding user: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getAllUsers = (req, res) => {
  return User.findAll().then((user) => {
    res.status(200);
    res.json(user);
  });
};

exports.putUser = (req, res) => {
  return User.update(req.body, { where: { id: req.params.id } })
    .then((user) => {
      res.status(200);
      res.json(user);
    })
    .catch((err) => {
      console.log(">> Error while updating user: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.deleteUser = (req, res) => {
  return User.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.status(200);
      res.json({ msg: "User deleted" });
    })
    .catch((err) => {
      console.log(">> Error while deleting user: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

/*
  login doesnt take care of the session Next.Auth is used for that
  Next.Auth needs the user object if the login is successful
*/
exports.login = (req, res) => {
  return User.findOne({ where: { email: req.body.email } })
    .then(async (user) => {
      if (user) {
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match){
           res.status(400)
           res.json({msg:"Invalid credentials"});
        }else {
          res.status(200);
          res.json( {user: user} );
        }
      } else {
        res.status(400);
        res.json({msg: "Invalid credentials"});
      }
    })
    .catch((err) => {
      console.log(">> Error while login user: ", err);
    });
};

exports.getUserWithEmail = (req, res) => {
  return User.findOne({ where: { email: req.params.email } })
    .then((user) => {
      res.status(200);
      res.json(user?.dataValues.id);
    })
    .catch((err) => {
      console.log(">> Error while finding user: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};
