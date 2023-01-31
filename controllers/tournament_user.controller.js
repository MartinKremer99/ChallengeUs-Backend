/*
  Logic behind Tournament_user
  Not fully implemented into the frontend
*/

const db = require("../models");
const  User  = db.user;
const Tournament_User = db.tournament_user;

exports.addTournament_User = (req, res) => {
  
  return Tournament_User.create(req.body)
    .then((tournament_user) => {
      console.log(
        ">> Created Tournament_User: " +
          JSON.stringify(tournament_user, null, 4)
      );
      res.status(201);
      res.json(tournament_user);
    })
    .catch((err) => {
      console.log(">> Error while creating tournament_user: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.putTournament_User = (req, res) => {
  return Tournament_User.update(req.body, { where: { id: req.params.id } })
    .then((tournament_user) => {
      res.status(200);
      res.json(tournament_user);
    })
    .catch((err) => {
      console.log(">> Error while updating tournament_user: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.deleteTournament_user = (req, res) => {
  return Tournament_User.destroy({ where: { userId: req.params.userId, tournamentId: req.params.tournamentId }})
    .then(() => {
      res.status(200);
      res.json({ msg: "Tournament_User deleted" });
    })
    .catch((err) => {
      console.log(">> Error while deleting tournament_user: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getAllTournament_UsersFromTournament = (req, res) => {
  return Tournament_User.findAll({
    where: { tournamentId: req.params.id },
    include: {
      model: User
    },
  }).then((tournament_user) => {
    
    res.status(200);
    res.json(tournament_user);
  });
};

exports.getUserRoleForTournament = (req, res) => {
  return Tournament_User.findAll({
    where: { tournamentId: req.params.id, userId: req.params.userId },
    include: {
      model: User
    },
  }).then((tournament_user) => {
    res.status(200);
    res.json(tournament_user);
  });
};
