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

  