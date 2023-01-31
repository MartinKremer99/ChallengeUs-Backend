/*
  Match model
*/

module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define("match", {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "Date is required" },
      },
    },
    score1: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    score2: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    finished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    phase: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    }
  });

  return Match;
};
