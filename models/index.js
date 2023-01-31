/*
  Logic for the relations
*/

const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tournament = require("./tournament.model.js")(sequelize, Sequelize);

db.user = require("./user.model.js")(sequelize, Sequelize);
db.tournament_user = require("./tournament_user.model.js")(
  sequelize,
  Sequelize
);
db.picture = require("./picture.model.js")(sequelize, Sequelize);
db.team = require("./team.model.js")(sequelize, Sequelize);
db.match = require("./match.model.js")(sequelize, Sequelize);
db.pool = require("./pool.model.js")(sequelize, Sequelize);

//Tournament - User: ONE TO MANY
db.user.hasMany(db.tournament, {
  foreignKey: { name: "userId", allowNull: false },
  as: "tournamentCreator",
});
db.tournament.belongsTo(db.user, {
  foreignKey: { name: "userId", allowNull: false },
  as: "tournamentCreator",
});

//Tournament - User: MANY TO MANY
db.user.belongsToMany(db.tournament, {
  through: db.tournament_user,
  as: "user"
});
db.tournament.belongsToMany(db.user, {
  through:db.tournament_user,
  as: "tournament"
});

db.tournament_user.belongsTo(db.user)
db.tournament_user.belongsTo(db.tournament)


//Picture - Tournament: ONE TO MANY
db.tournament.hasMany(db.picture, {
  foreignKey: { name: "tournamentId", allowNull: false },
  as: "tournamentPicture",
});
db.picture.belongsTo(db.tournament, {
  foreignKey: { name: "tournamentId", allowNull: false },
  as: "tournamentPicture",
});
//Picture - User: ONE TO MANY
db.user.hasMany(db.picture, {
  foreignKey: { name: "userId", allowNull: false },
  as: "userPicture",
});
db.picture.belongsTo(db.user, {
  foreignKey: { name: "userId", allowNull: false },
  as: "userPicture",
});

//Team - User: ONE TO MANY
db.user.hasMany(db.team, {
  foreignKey: { name: "userId", allowNull: false },
  as: "teamCreator",
});
db.team.belongsTo(db.user, {
  foreignKey: { name: "userId", allowNull: false },
  as: "teamCreator",
});

//Pool - Tournament: ONE TO MANY
db.tournament.hasMany(db.pool, {
  foreignKey: { name: "tournamentId", allowNull: false },
  as: "poolTournament",
});
db.pool.belongsTo(db.tournament, {
  foreignKey: { name: "tournamentId", allowNull: false },
  as: "poolTournament",
});

//Team - Tournament: ONE TO MANY
db.tournament.hasMany(db.team, {
  foreignKey: { name: "tournamentId", allowNull: false },
  as: "teamTournament",
});
db.team.belongsTo(db.tournament, {
  foreignKey: { name: "tournamentId", allowNull: false },
  as: "teamTournament",
});

//Team - Pool: ONE TO MANY
db.pool.hasMany(db.team, {
  foreignKey: { name: "poolId", allowNull: true },
  as: "teamPool",
});
db.team.belongsTo(db.pool, {
  foreignKey: { name: "poolId", allowNull: true },
  as: "teamPool",
});

//Match - Team - Team: ONE TO MANY
db.match.belongsTo(db.team, {
  foreignKey: { name: "team1Id", allowNull: false },
  as: "team1",
});
db.match.belongsTo(db.team, {
  foreignKey: { name: "team2Id", allowNull: false },
  as: "team2",
});
db.team.hasMany(db.match, {
  foreignKey: { name: "team1Id", allowNull: false },
  as: "team1",
});
db.team.hasMany(db.match, {
  foreignKey: { name: "team1Id", allowNull: false },
  as: "team2",
});

//Match - Tournament: ONE TO MANY
db.tournament.hasMany(db.match, {
  foreignKey: { name: "tournamentId", allowNull: false },
  as: "matchTournament",
});
db.match.belongsTo(db.tournament, {
  foreignKey: { name: "tournamentId", allowNull: false },
  as: "matchTournament",
});

//Match - Pool: ONE TO MANY
db.pool.hasMany(db.match, {
  foreignKey: { name: "poolId", allowNull: true },
  as: "matchPool",
});
db.match.belongsTo(db.pool, {
  foreignKey: { name: "poolId", allowNull: true },
  as: "matchPool",
});

module.exports = db;