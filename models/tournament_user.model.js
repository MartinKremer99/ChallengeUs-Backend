/*
  Tournament_User Model
*/

module.exports = (sequelize, DataTypes) => {
  const Tournament_user = sequelize.define("tournament_user", {
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Role is required" },
      },
    },
  });
  return Tournament_user;
};
