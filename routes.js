"use strict";

const express = require("express");
const router = express.Router();

const trainerdashboard = require("./controllers/trainerdashboard.js");
const about = require("./controllers/about.js");
const dashboard = require("./controllers/dashboard.js");
const accounts = require('./controllers/accounts.js');

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);
router.post("/update/", accounts.update);
router.get("/settings", accounts.settings)

router.get("/", trainerdashboard.index);
router.get("/trainerdashboard", trainerdashboard.index);
router.get("/trainerdashboard/deletemember/:id", trainerdashboard.deleteMember);
router.post("/trainerdashboard/addmember", trainerdashboard.addMember);
router.get('/trainerdashboard/:id', trainerdashboard.trainerAssessment);
router.post('/editcomment/:id', trainerdashboard.editComment);
router.post("/member/updatesettings/:id", dashboard.update);



router.get("/about", about.index);
router.get("/dashboard/:id", dashboard.index);
router.get("/dashboard/:id/deleteassessment/:assessmentid", dashboard.deleteAssessment);
router.post("/dashboard/:id/addassessment", dashboard.addAssessment);

module.exports = router;
