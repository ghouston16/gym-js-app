"use strict";

const logger = require("../utils/logger");
const memberStore = require("../models/member-store");
const uuid = require("uuid");
const accounts = require ('./accounts.js');
const gymutil = require("../utils/gymutility.js")

const trainerdashboard = {
  index(request, response) {
    logger.info("trainerdashboard rendering");
    const viewData = {
      title: "Dashboard",
      members: memberStore.getAllMembers()
    };
    logger.info("about to render", memberStore.getAllMembers());
    response.render("trainerdashboard", viewData);
  },

  deleteMember(request, response) {
    const memberId = request.params.id;
    logger.debug(`Deleting member ${memberId}`);
    memberStore.removeMember(memberId);
    response.redirect("/trainerdashboard");
  },

  addMember(request, response) {
    const newMember = {
      id: uuid.v1(),
      email: request.body.email,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      password: request.body.password,
      age: request.body.age,
      gender: request.body.gender,
      height: request.body.height,
      startingWeight: request.body.startingWeight,
      assessments: []
    };
    logger.debug("Creating a new member", newMember);
    memberStore.addMember(newMember);
    response.redirect("/login");
  },
  trainerAssessment(request, response){
    const memberid = request.params.id;
    const member = memberStore.getMember(memberid);
    response.cookie('member', member.id);
    let trainer = request.cookies.user;
   // const label = "Goals";
    let add =   "";
    let list = "updateassessment";
  //  const link = "/trainerdashboard/goals";

    const viewData = {
      assessment: member.assessments,
      member : member,
      bmi:  gymutil.bmi(member),
      //goalstatus: gymutil.goal(member),
      idealweight: gymutil.idealweight(member),
      trainer:trainer,
      //label: label,
      list: list,
     // link: link,

    };
    response.render('trainerassessment', viewData);
  },
  editComment(request,response){
    const memberId = request.cookies.member;
    const member = memberStore.getMember(memberId);

    const assessment = memberStore.getAssessment(request.params.id);
    const assessmentid = request.params.id;
    const comment = request.body.comment;

    logger.debug('Add Comment to Assessment', comment);
    memberStore.addComment(assessmentid,memberId, comment);
    response.redirect('/trainerdashboard');
  },
};

module.exports = trainerdashboard;
