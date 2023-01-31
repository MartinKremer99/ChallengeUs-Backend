/*
  Logic behind the Teams
*/

const db = require("../models");
const Team = db.team;
const { Op } = require("sequelize");

/*
  When creating a tournament placeholder teams will be created these will be replaced with teams that signup
  1. Get the first Placeholder Team of that tournament
  2. Update the team with the teams info that is registering
  3. If you receive no team the tournament if full
*/

exports.addTeam = (req, res) => {
  Team.findAll({
    limit: 1,
    where: {
      name: {
        [Op.like]: "%PlaceHolder%",
      },
      tournamentId: req.params.id,
    },
    order: [['createdAt','ASC']]
  }).then((team)=> {
    if(team.length){
      return Team.update(req.body, { where: { id: team[0].id} })
    .then((team) => {
      console.log(">> Created Team: " + JSON.stringify(team, null, 4));
      res.status(201);
      res.json(team);
    })
    .catch((err) => {
      console.log(">> Error while creating team: ", err);
      res.status(400);
      res.json({ msg: err });
    });
    }else{
      res.status(404);
      res.json({ msg: "Tournament is full" });
    }
    
  })
  
};

exports.getTeam = (req, res) => {
  return Team.findByPk(req.params.id, {
    include: ["teamCreator", "teamPool"],
  })
    .then((team) => {
      res.status(200);
      res.json(team);
    })
    .catch((err) => {
      console.log(">> Error while finding team: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};



exports.putTeam = (req, res) => {
  return Team.update(req.body, { where: { id: req.params.id } })
    .then((team) => {
      res.status(200);
      res.json(team);
    })
    .catch((err) => {
      res.status(400);
      res.json({ msg: err });
    });
};

exports.deleteTeam = (req, res) => {
  return Team.update(
    { name: `PlaceHolder${req.params.id}` },
    { where: { id: req.params.id } }
  )
    .then(() => {
      res.status(200);
      res.json({ msg: "Team deleted" });
    })
    .catch((err) => {
      res.status(400);
      res.json({ msg: err });
    });
};

exports.approveTeam = (req, res) => {
  return Team.update({ approved: true }, { where: { id: req.params.id } })
    .then(() => {
      res.status(200);
      res.json({ msg: "Successfully approved Team " });
    })
    .catch((err) => {
      res.status(400);
      res.json({ msg: err });
    });
};

exports.payTeam = (req, res) => {
  return Team.update({ paid: true }, { where: { id: req.params.id } })
    .then(() => {
      res.status(200);
      res.json({ msg: "Team successfully paid" });
    })
    .catch((err) => {
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getAllUnapprovedTeams = (req, res) => {
  return Team.findByPk(req.params.id, {
    include: ["teamCreator", "teamPool"],
    where: {approved:false}
  })
    .then((team) => {
      res.status(200);
      res.json(team);
    })
    .catch((err) => {
      console.log(">> Error while finding team: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getAllTeamsFromTournament = (req, res) => {
  return Team.findAll({
    include: ["teamCreator", "teamPool"],
    where: {tournamentId:req.params.id, name: {
      [Op.notLike]: "PlaceHolder%",
    }}
  })
    .then((team) => {
      res.status(200);
      res.json(team);
    })
    .catch((err) => {
      console.log(">> Error while finding team: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};
