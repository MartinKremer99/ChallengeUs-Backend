/*
  Logic of tournaments
*/

const db = require("../models");
const Tournament = db.tournament;
const Team = db.team;
const Match = db.match;
const Pool = db.pool;
const { Op } = require("sequelize");


/*
  When creating a tournament it will be filled up with placeholder teams
  so that the first matches can be generated.
  1. Create placeholder teams
  2. depending if the pools exist or not
  3. if pools dont exist, create matches in this play order for 8 teams: 1vs8 2vs7 3vs6 4vs5
  4. if pool exist, create a pool and create 6 matches for every pool
*/

exports.addTournament = (req, res) => {
  return Tournament.create(req.body)
    .then(async (tournament) => {
      console.log(
        ">> Created Tournament: " + JSON.stringify(tournament, null, 4)
      );
      let teams = [];
        for (let index = 1; index <= tournament.tournamentSize; index++) {
          await Team.create({
            name: `PlaceHolder${index}`,
            approved: false,
            paid: false,
            userId: 1,
            tournamentId: tournament.id,
          }).then((team) => {
            teams.push(team.dataValues);
          });
        }
      if (tournament.poolAmount == 0) {
        

        let lastTeam = teams[teams.length - 1].id;
        for (
          let index = 0;
          index <= tournament.tournamentSize / 2 - 1;
          index++
        ) {
          await Match.create({
            date: new Date(),
            team1Id: teams[index].id,
            team2Id: lastTeam,
            tournamentId: tournament.id,
          });
          lastTeam--;
        }
      }
      else {
        let poolId = 0;
        for (let p = 1; p <= tournament.poolAmount; p++) {
          await Pool.create({tournamentId: tournament.id}).then((pool)=>{
            poolId = pool.id
          });
          for (let i = 0;i < 3; i++) {
            for (let j = i+1; j < 4; j++){
              await Match.create({
                date: new Date(),
                team1Id: teams[i+((p-1)*4)].id,
                team2Id: teams[j+((p-1)*4)].id,
                tournamentId: tournament.id,
                poolId,
              })
            }
          }
        }
      }
      res.status(201);
      res.json(tournament);
    })
    .catch((err) => {
      console.log(">> Error while creating tournament: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getTournament = (req, res) => {
  return Tournament.findByPk(req.params.id, {
    include: ["tournamentCreator"],
  })
    .then((tournament) => {
      res.status(200);
      res.json(tournament);
    })
    .catch((err) => {
      console.log(">> Error while finding tournament: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getAllTournaments = (req, res) => {
  return Tournament.findAll({
    include: ["tournamentCreator"],
  }).then((tournament) => {
    res.status(200);
    res.json(tournament);
  });
};

exports.getAllPublicTournaments = (req, res) => {
  return Tournament.findAll({
    include: ["tournamentCreator"],
    where: { public: true },
  }).then((tournament) => {
    res.status(200);
    res.json(tournament);
  });
};

exports.getAllPrivateTournaments = (req, res) => {
  return Tournament.findAll({
    include: ["tournamentCreator"],
    where: { public: false, approved:true },
  }).then((tournament) => {
    res.status(200);
    res.json(tournament);
  });
};

exports.putTournament = (req, res) => {
  return Tournament.update(req.body, { where: { id: req.params.id } })
    .then((tournament) => {
      res.status(200);
      res.json(tournament);
    })
    .catch((err) => {
      console.log(">> Error while updating tournament: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.deleteTournament = (req, res) => {
  return Tournament.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.status(200);
      res.json({ msg: "Tournament deleted" });
    })
    .catch((err) => {
      console.log(">> Error while deleting tournament: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.publicTournament = (req, res) => {
  return Tournament.update({ public: true }, { where: { id: req.params.id } })
    .then((tournament) => {
      res.status(200);
      res.json(tournament);
    })
    .catch((err) => {
      console.log(">> Error while making tournament public: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getPrivateTournament = (req, res) => {
  return Tournament.findOne({
    where: { key: req.params.key },
    include: ["tournamentCreator"],
  })
    .then((tournament) => {
      res.status(200);
      res.json(tournament);
    })
    .catch((err) => {
      console.log(">> Error while finding tournament: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getAllUpcomingTournaments = (req, res) => {
  return Tournament.findAll({
    where: { startDate: { [Op.gte]: moment().toDate() } },
    include: ["tournamentCreator"],
  })
    .then((tournament) => {
      res.status(200);
      res.json(tournament);
    })
    .catch((err) => {
      console.log(">> Error while finding tournament: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getAllFinishedTournaments = (req, res) => {
  return Tournament.findAll({
    where: { endDate: { [Op.lte]: moment().toDate() } },
    include: ["tournamentCreator"],
  })
    .then((tournament) => {
      res.status(200);
      res.json(tournament);
    })
    .catch((err) => {
      console.log(">> Error while finding tournament: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getAllOngoingTournaments = (req, res) => {
  return Tournament.findAll({
    where: {
      endDate: { [Op.gte]: moment().toDate() },
      startDate: { [Op.lte]: moment().toDate() },
    },
    include: ["tournamentCreator"],
  })
    .then((tournament) => {
      res.status(200);
      res.json(tournament);
    })
    .catch((err) => {
      console.log(">> Error while finding tournament: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getAllUnapprovedTournaments = (req, res) => {
  return Tournament.findAll({
    where: {
      approved: false,
    },
    include: ["tournamentCreator"],
  })
    .then((tournament) => {
      res.status(200);
      res.json(tournament);
    })
    .catch((err) => {
      console.log(">> Error while finding tournament: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.approveTournament = (req, res) => {
  return Tournament.update({ approved: true }, { where: { id: req.params.id } })
    .then((tournament) => {
      res.status(200);
      res.json(tournament);
    })
    .catch((err) => {
      console.log(">> Error while making tournament approved: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.privateTournament = (req, res) => {
  return Tournament.update({ public: false }, { where: { id: req.params.id } })
    .then((tournament) => {
      res.status(200);
      res.json(tournament);
    })
    .catch((err) => {
      console.log(">> Error while making tournament private: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getAllMyTournaments = (req, res) => {
  return Tournament.findAll({
    where: {
      userId:req.params.id
    },
    include: ["tournamentCreator"],
  })
    .then((tournament) => {
      res.status(200);
      res.json(tournament);
    })
    .catch((err) => {
      console.log(">> Error while finding tournament: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};
