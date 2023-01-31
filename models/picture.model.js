/*
  Picture Model (not in use)
*/

module.exports = (sequelize, DataTypes) => {
  const Picture = sequelize.define("picture", {
    alt: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Picture has no alt",
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "Link is required" },
      },
    },
  });
  return Picture;
};
