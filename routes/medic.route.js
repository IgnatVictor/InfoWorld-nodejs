const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const atob = require("atob");
const upload = multer({ dest: "ups/" });

router.post("/", upload.single("file"), (req, res) => {
  let token = req.headers["x-vamf-jwt"];
  let tokenString = atob(JSON.stringify(token));
  tokenObject = JSON.parse(tokenString);

  if (
    tokenObject.roles.includes("Admin") ||
    tokenObject.roles.includes("Practitioner")
  ) {
    if (req.headers["content-type"].includes("multipart/form-data")) { // daca e csv
      let content = fs.readFileSync(req.file.path, "binary");
      if (content === undefined) {
        return res.status(201).json("File added");
      }
      const medics = parseCSV(content, req.file.path); // returnam obiectul

      printHospitalAndMedic(medics, tokenObject.facility); // printam 
      res.status(200).send("Csv Read");
    } else { 
      if (!req.body.id || req.body.resourceType !== "Practitioner") {
        console.log("You are not authorized to access this.");
        res.status(401).send("You are not authorized to access this.");
      } else {
        if (req.body.active) {
          let facilities = [];
          req.body.facility.forEach((facility) => {
            if (tokenObject.facility.includes(facility.value)) {
              facilities.push(facility);
            }
          });

          facilities.forEach((facility) => {
            console.log(req.body.name[0].text + ": " + facility.name);
          });
          res.status(200).send("ok you can see results in terminal log");
        }
      }
    }
  } else {
    console.log("You have no access on this point.");
    res.status(401).send("You have no access on this point.");
  }
});

function parseCSV(csv, path) {
  const rows = csv.trim().split("\n");
  const rawData = rows.map((d) => d.split(","));

  const headers = rawData[0];
  const data = rawData.slice(1);

  const parsedData = data.map((row) => {
    const obj = {};
    headers.forEach((h, i) => {
      let trimmed = h.trim();
      //   console.log(trimmed)

      let camelize = trimmed
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, ""); // cammelcase
      console.log(camelize);

      obj[camelize] = row[i].trim(); /// se adauga la fiecare header continutul.
    });
    return obj; // returneaza obiectul sub forma de json
  });

  fs.unlink(path, () => {}); // remove la file dupa

  return parsedData;
}

function printHospitalAndMedic(medics, facility) {
  let hospitalsByMedic = {};
  var SameIdError= true;

  medics.forEach((medic) => {
    if (facility.includes(medic.facilityId)) {
      let name = medic.familyName + " " + medic.givenName;
      hospitalsByMedic[medic.iD] = hospitalsByMedic[medic.iD] || {
        name,
        hospitals: [],
      };

      if (hospitalsByMedic[medic.iD].name !== name) {
        console.log(
          `'Csv has same id on different names' ${medic.iD} `
        );
        SameIdError=false;
      }

      if (medic.active === "true") {
        hospitalsByMedic[medic.iD].hospitals.push(medic.nameId);
      }
    }
  });

  // show data
  if(SameIdError) {
  for (const [key, value] of Object.entries(hospitalsByMedic)) {
    console.log(value.name + ": " + value.hospitals);
  } 
}
}



module.exports = router;
