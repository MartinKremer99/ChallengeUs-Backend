/*
  All API Endpoints
  Some of them are currently not in use

*/

"use strict";
module.exports = function (app) {
  //CONTROLLERS
  var tournament = require("../controllers/tournament.controller");
  var user = require("../controllers/user.controller");
  var tournament_user = require("../controllers/tournament_user.controller");
  var team = require("../controllers/team.controller");
  var picture = require("../controllers/picture.controller");
  var match = require("../controllers/match.controller");

  //TOURNAMENT
  app.route("/tournament/addTournament").post(tournament.addTournament);
  app.route("/tournament/getTournament/:id").get(tournament.getTournament);
  app.route("/tournament/getAllTournaments").get(tournament.getAllTournaments);
  app.route("/tournament/putTournament/:id").put(tournament.putTournament);
  app.route("/tournament/deleteTournament/:id").delete(tournament.deleteTournament);
  app.route("/tournament/advanceTournament/:id").put(match.advanceTournament);
  app.route("/tournament/advanceToBracket/:id").put(match.advanceToBracket);
  app.route("/tournament/getAllPublicTournaments").get(tournament.getAllPublicTournaments);
  app.route("/tournament/getAllPrivateTournaments").get(tournament.getAllPrivateTournaments);
  app.route("/tournament/publicTournament/:id").put(tournament.publicTournament);
  app.route("/tournament/privateTournament/:id").put(tournament.privateTournament);
  app.route("/tournament/getPrivateTournament/:key").get(tournament.getPrivateTournament);
  app.route("/tournament/setPhaseTime/:id").put(match.putPhaseTime);
  app.route("/tournament/getAllUpcomingTournaments").get(tournament.getAllUpcomingTournaments);
  app.route("/tournament/getAllOngoingTournaments").get(tournament.getAllOngoingTournaments);
  app.route("/tournament/getAllFinishedTournaments").get(tournament.getAllFinishedTournaments);
  app.route("/tournament/getAllUnapprovedTournaments").get(tournament.getAllUnapprovedTournaments);
  app.route("/tournament/approveTournament/:id").put(tournament.approveTournament);
  app.route("/tournament/getAllMyTournaments/:id").get(tournament.getAllMyTournaments);

  //USER
  app.route("/user/getAllUsers").get(user.getAllUsers);
  app.route("/user/addUser").post(user.addUser);
  app.route("/user/getUser/:id").get(user.getUser);
  app.route("/user/getUserWithEmail/:email").get(user.getUserWithEmail);
  app.route("/user/putUser/:id").put(user.putUser);
  app.route("/user/deleteUser/:id").delete(user.deleteUser);
  app.route("/user/login").post(user.login);

  //TOURNAMENT_USER
  app.route("/tournament_user/addTournament_User").post(tournament_user.addTournament_User);
  app.route("/tournament_user/putTournament_User/:id").put(tournament_user.putTournament_User);
  app.route("/tournament_user/deleteTournament_User/:userId/:tournamentId").delete(tournament_user.deleteTournament_user);
  app.route("/tournament_user/getAllTournament_UsersFromTournament/:id").get(tournament_user.getAllTournament_UsersFromTournament);
  app.route("/tournament_user/getUserRolesForTournament/:userId/:id").get(tournament_user.getUserRoleForTournament);

  //TEAM
  app.route("/team/addTeam/:id").post(team.addTeam);
  app.route("/team/getTeam/:id").get(team.getTeam);
  app.route("/team/putTeam/:id").put(team.putTeam);
  app.route("/team/deleteTeam/:id").put(team.deleteTeam);
  app.route("/team/approveTeam/:id").put(team.approveTeam);
  app.route("/team/payTeam/:id").put(team.payTeam);
  app.route("/team/getAllUnapprovedTeams/:id").get(team.getAllUnapprovedTeams);
  app.route("/team/getAllTeamsFromTournament/:id").get(team.getAllTeamsFromTournament);

  //PICTURE
  app.route("/picture/addPicture").post(picture.addPicture);
  app.route("/picture/deletePicture/:id").delete(picture.deletePicture);

  //MATCH
  app.route("/match/putMatch/:id").put(match.putMatch);
  app.route("/match/finishMatch/:id").put(match.finishMatch);
  app.route("/match/getAllMatchesFromTournament/:id").get(match.getAllMatchesFromTournament);
  app.route("/match/getAllMatchesFromPhase/:phase/FromTournament/:id").get(match.getAllMatchesFromPhaseFromTournament);
  app.route("/match/getAllMatchesFromPoolPhase/:id").get(match.getAllMatchesFromPoolPhase);
};
