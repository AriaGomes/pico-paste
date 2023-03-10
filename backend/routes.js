const express = require("express");
const recordRoutes = express.Router();
const mongoose = require("mongoose");

//Schemas
let pasteSchema = new mongoose.Schema({
  paste: String,
  ip: String,
  useragent: String,
  options: {
    isCode: Boolean,
    lineNumbers: Boolean,
  },
  //More stuff like options of paste (Syntax highlighting, etc)
});

let Paste = mongoose.model("paste", pasteSchema);

recordRoutes.route("/status").get(function (req, res) {
  mongoose
    .connect(process.env.MONGO, {
      useNewUrlParser: true,
    })
    .then(() => {
      res.send("Connected to mongo");
    })
    .catch(async (err) => {
      console.log(err.message);
      res.send("Issue trying to connect to mongo");
    });
});

// This section will help you get a single record by id
recordRoutes.route("/pastes/:id").get(function (req, res) {
  // Serve paste by id

  mongoose
    .connect(process.env.MONGO, {
      useNewUrlParser: true,
    })
    .then(() => {
      if (req.params.id.length !== 24) {
        return res.send("Invalid ID");
      }

      Paste.find({ _id: req.params.id }, async function (err, pasteFound) {
        if (err) return console.log(err);

        if (pasteFound.length > 0) {
          res.send(JSON.stringify(pasteFound[0]));
        } else {
          res.status(404).send("Not Found");
        }
      });
    })
    .catch((err) => console.log(err.message));
});

recordRoutes.route("/pastes/raw/:id").get(function (req, res) {
  // Serve paste by id
  mongoose
    .connect(process.env.MONGO, {
      useNewUrlParser: true,
    })
    .then(() => {
      if (req.params.id.length !== 24) {
        return res.send("Invalid ID");
      }

      Paste.find({ _id: req.params.id }, async function (err, pasteFound) {
        if (err) return console.log(err);

        if (pasteFound.length > 0) {
          res.send(pasteFound[0].paste);
        } else {
          res.status(404).send("Not Found");
        }
      });
    })
    .catch((err) => console.log(err.message));
});

// // This section will help you create a new record.
recordRoutes.route("/pastes/add").post(function (req, res) {
  mongoose
    .connect(process.env.MONGO, {
      useNewUrlParser: true,
    })
    .then(() => {
      Paste.find(
        { paste: req.body.paste, options: req.body.options },
        async function (err, pasteFound) {
          if (err) return console.log(err);

          if (pasteFound.length > 0) {
            res.send(JSON.stringify(pasteFound[0]));
            //return pasteFound instead of creating a new one
          } else {
            let paste = new Paste({
              useragent: req.get("user-agent"),
              ip: req.ip,
              paste: req.body.paste,
              options: {
                isCode: req.body.options?.isCode,
                lineNumbers: req.body.options?.lineNumbers,
              },
            });

            paste.save((error, data) => {
              if (error) {
                res.send("Error: " + error);
                return console.log(error);
              }
              console.log(data);
              res.send(JSON.stringify(data));
            });
          }
        }
      );
    })
    .catch((err) => console.log(err.message));
});

//Admin Routes for future

// // This section will help you get a list of all the records.
// recordRoutes.route("/pastes").get(function (req, res) {
//     mongoose
//       .connect(process.env.MONGO, {
//         useNewUrlParser: true,
//       })
//       .then(() => {
//         console.log("Connected to mongo");
//       })
//       .catch((err) => console.log(err.message));
//   });

// // This section will help you update a record by id.
// recordRoutes.route("/update/:id").post(function (req, response) {
//  let db_connect = dbo.getDb();
//  let myquery = { _id: ObjectId(req.params.id) };
//  let newvalues = {
//    $set: {
//      name: req.body.name,
//      position: req.body.position,
//      level: req.body.level,
//    },
//  };
//  db_connect
//    .collection("records")
//    .updateOne(myquery, newvalues, function (err, res) {
//      if (err) throw err;
//      console.log("1 document updated");
//      response.json(res);
//    });
// });

// // This section will help you delete a record
// recordRoutes.route("/:id").delete((req, response) => {
//  let db_connect = dbo.getDb();
//  let myquery = { _id: ObjectId(req.params.id) };
//  db_connect.collection("records").deleteOne(myquery, function (err, obj) {
//    if (err) throw err;
//    console.log("1 document deleted");
//    response.json(obj);
//  });
// });

module.exports = recordRoutes;
