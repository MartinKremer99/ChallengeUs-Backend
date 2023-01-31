/*
  Tournament Model
  id is a UUID for a less predictable path when going to /tournaments/{id} in the frontend
  also check if the tournament size is of a base of two => 2 4 8 16 32 ...
  this check will still be done on the frontend
*/

module.exports = (sequelize, DataTypes) => {
  const Tournament = sequelize.define("tournament", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "Name is required" },
      },
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: { msg: "Deadline is required" },
      },
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: { msg: "Date is required" },
      },
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: { msg: "Date is required" },
      },
    },
    tournamentSize: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: { msg: "Tournament size is required" },
        isBaseOfTwo(value) {
          if (Math.log2(value) % 1 !== 0) {
            throw new Error("Only tournament size of a base of 2 are allowed");
          }
        },
      },
    },
    poolAmount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: "https://cdn-icons-png.flaticon.com/512/857/857455.png",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Location is required" },
      },
    },
    sport: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Sport name is required" },
      },
    },
    teamSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Team size is required" },
      },
    },
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  });

  return Tournament;
};
