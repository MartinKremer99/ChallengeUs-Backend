/*
  Logic behind the Matches
*/


const db = require("../models");
const Match = db.match;
const { Op } = require("sequelize");


/*
  1. Get the phase that is currently ongoing
  2. Get all matches from a tournament that are not in a pool
  3. Check if tournament will be over with this phase
  4. Check if all matches are finished
  5. Check who won
  6. Create the next set of matches if there is a next phase and all matches are finished
*/
exports.advanceTournament = async (req, res) => {
  let phase = await Match.max("phase", {
    where: { tournamentId: req.params.id },
  });
  return Match.findAll({
    include: ["matchTournament", "team1", "team2"],
    where: {
      tournamentId: req.params.id,
      phase: phase,
      poolId: null,
    },
  })
    .then(async (matches) => {
      if (phase < Math.log2(matches[0].matchTournament.tournamentSize)) {
        let teams = [];
        let msg = "";
        for (let index = 0; index < matches.length; index++) {
          if (matches[index].finished) {
            console.log(matches[index].finished);
            if (matches[index].score1 > matches[index].score2) {
              teams.push(matches[index].team1Id);
            } else {
              teams.push(matches[index].team2Id);
            }
          } else {
            msg = "Not all matches finished.";
          }
        }
        if (!(msg == "Not all matches finished.")) {
          for (let index = 0; index < teams.length; index++) {
            await Match.create({
              date: "2022-12-05T07:59:01.430Z",
              team1Id: teams[index],
              team2Id: teams[index + 1],
              tournamentId: req.params.id,
              phase: phase + 1,
            });
            index++;
            msg = "Tournament advanced";
          }
          res.status(200);
          res.json({ msg: msg });
        } else {
          console.log("Not all finished");
          res.status(400);
          res.json({ msg: msg });
        }
      } else {
        res.status(401);
        res.json({ msg: "Tournament finished" });
      }
    })
    .catch((err) => {
      console.log(">> Error while finding tournament: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

/*
  1. Get all matches from a tournament that are in the pool phase
  2. Check if all matches are finished
  3. Write the scores into an array of objects depending on the pool and team
  4. Sort the teams depending on the scores
  5. Create new set of matches with the first 2 teams of every pool
*/

exports.advanceToBracket = async (req, res) => {
  return Match.findAll({
    include: ["matchTournament", "team1", "team2"],
    where: {
      tournamentId: req.params.id,
      poolId: { [Op.not]: null },
    },
  })
    .then(async (matches) => {
      let msg = "";
      for (let index = 0; index < matches.length; index++) {
        if (!(matches[index].finished)) {
          msg = "Not all matches finished.";
        }
      }
      if (!(msg == "Not all matches finished.")) {
        let advancingTeams = []
        const pools = {};
        matches.forEach((match) => {
          if (!pools[match.poolId]) pools[match.poolId] = {};
          if (!pools[match.poolId][match.team1Id])
            pools[match.poolId][match.team1Id] = 0;
          if (!pools[match.poolId][match.team2Id])
            pools[match.poolId][match.team2Id] = 0;
          if (match.score1 > match.score2) {
            pools[match.poolId][match.team1Id] += 3;
          } else if (match.score2 > match.score1) {
            pools[match.poolId][match.team2Id] += 3;
          } else {
            pools[match.poolId][match.team1Id] += 1;
            pools[match.poolId][match.team2Id] += 1;
          }
        });
        for (const poolId in pools) {
          const sortedTeams = Object.keys(pools[poolId]).sort(
            (a, b) => pools[poolId][b] - pools[poolId][a]
          );
          advancingTeams.push(sortedTeams[0])
          advancingTeams.push(sortedTeams[1])
        }
        let lastTeam = advancingTeams[advancingTeams.length - 1];
        for (
          let index = 0;
          index < advancingTeams.length/2;
          index++
        ) {
          await Match.create({
            date: new Date(),
            team1Id: advancingTeams[index],
            team2Id: lastTeam,
            tournamentId: matches[0].matchTournament.id,
          });
          lastTeam--;
        }
        res.status(200);
        res.json({ msg: "Tournament advanced to Bracket" });
      } else {
        console.log("Not all finished");
        res.status(400);
        res.json({ msg: msg });
      }
    })
    .catch((err) => {
      console.log(">> Error while finding tournament: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.finishMatch = (req, res) => {
  return Match.update({ finished: true }, { where: { id: req.params.id } })
    .then((match) => {
      res.status(200);
      res.json(match);
    })
    .catch((err) => {
      console.log(">> Error while updating match: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.putScore = (req, res) => {
  return Match.update(req.body, { where: { id: req.params.id } })
    .then((match) => {
      res.status(200);
      res.json(match);
    })
    .catch((err) => {
      console.log(">> Error while updating score: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

/*
  Not in use
  Idea: declare when the matches will be played
*/

exports.putPhaseTime = async (req, res) => {
  let phase = await Match.max("phase", {
    where: { tournamentId: req.params.id },
  });
  return Match.update(req.body, {
    where: { tournamentId: req.params.id, phase: phase },
  })
    .then((match) => {
      res.status(200);
      res.json(match);
    })
    .catch((err) => {
      console.log(">> Error while updating time: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getAllMatchesFromTournament = (req, res) => {
  return Match.findAll({
    where: {
      tournamentId: req.params.id,
      poolId: null,
    },
    include: ["matchTournament", "team1", "team2"],
  })
    .then((match) => {
      res.status(200);
      res.json(match);
    })
    .catch((err) => {
      console.log(">> Error while finding match: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getAllMatchesFromPhaseFromTournament = (req, res) => {
  return Match.findAll({
    where: {
      tournamentId: req.params.id,
      phase: req.params.phase,
      poolId: null,
    },
    include: ["matchTournament", "team1", "team2"],
  })
    .then((match) => {
      res.status(200);
      res.json(match);
    })
    .catch((err) => {
      console.log(">> Error while finding match: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.getAllMatchesFromPoolPhase = (req, res) => {
  return Match.findAll({
    where: {
      tournamentId: req.params.id,
      poolId: { [Op.not]: null },
    },
    include: ["matchTournament", "team1", "team2"],
  })
    .then((match) => {
      res.status(200);
      res.json(match);
    })
    .catch((err) => {
      console.log(">> Error while finding match: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.putMatch = (req, res) => {
  return Match.update(req.body, { where: { id: req.params.id } })
    .then((match) => {
      res.status(200);
      res.json(match);
    })
    .catch((err) => {
      console.log(">> Error while updating match: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};
