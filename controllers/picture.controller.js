/*
  Not in use
*/

const db = require("../models");
const Picture = db.picture;

exports.addPicture = (req, res) => {
  return Picture.create(req.body)
    .then((picture) => {
      console.log(
        ">> Created Picture: " + JSON.stringify(picture, null, 4)
      );
      res.status(201);
      res.json(picture);
    })
    .catch((err) => {
      console.log(">> Error while creating picture: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};

exports.deletePicture = (req, res) => {
  return Picture.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.status(200);
      res.json({ msg: "Picture deleted" });
    })
    .catch((err) => {
      console.log(">> Error while deleting picture: ", err);
      res.status(400);
      res.json({ msg: err });
    });
};
