const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const atob = require("atob");
const upload = multer({ dest: "ups/" });
const printHospitalAndMedic = require("../service/service.doctor");
const parseCSV = require("../utils/parseCsv");

router.post("/", upload.single("file"), (req, res) => {
  let token = req.headers["x-vamf-jwt"];
  let tokenString = atob(JSON.stringify(token));
  tokenObject = JSON.parse(tokenString);

  if (
    tokenObject.roles.includes("Admin") ||
    tokenObject.roles.includes("Practitioner")
  ) {
    if (verifyIfCsv(req)) {     
      let content = fs.readFileSync(req.file.path, "binary");
      const medics = parseCSV(content, req.file.path); 

      printHospitalAndMedic(medics, tokenObject.facility); 
      res.status(200).send("Csv Read");
    } else {
      if (!req.body.id || req.body.resourceType !== "Practitioner") {
        console.log("You are not authorized to access this.");
        res.status(401).send("You are not authorized to access this.");
      } else {
        if (req.body.active) {
          
          let facilities = validateFacilities(req);

          printDoctorAndFacility(facilities, req);
          res.status(200).send("ok you can see results in terminal log");
        }
      }
    }
  } else {
    console.log("You have no access on this point.");
    res.status(401).send("You have no access on this point.");
  }
});

function verifyIfCsv(req) {
  return req.headers["content-type"].includes("multipart/form-data");
}

function validateFacilities(req) {
  let facilities = [];
  req.body.facility.forEach((facility) => {
    if (tokenObject.facility.includes(facility.value)) {
      facilities.push(facility);
    }
  });
  return facilities;
}

function printDoctorAndFacility(facilities, req) {
  facilities.forEach((facility) => {
    console.log(req.body.name[0].text + ": " + facility.name);
  });
}

module.exports = router;
