"use strict";

const logger = require("../utils/logger");
const memberStore = require("../models/member-store");
const uuid = require("uuid");
const accounts = require("./accounts.js");
const gymutil = require("../utils/gymutility.js");

const trainerdashboard = {
  index(request, response) {
    logger.info("trainerdashboard rendering");
    const viewData = {
      title: "Dashboard",
      members: memberStore.getAllMembers(),
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
      assessments: [],
      goals: [],
      missed: [],
      current: [],
      achieved: []
    };
    logger.debug("Creating a new member", newMember);
    memberStore.addMember(newMember);
    response.redirect("/login");
  },
  trainerAssessment(request, response) {
    const memberid = request.params.id;
    const member = memberStore.getMember(memberid);
    response.cookie("member", member.id);
    let trainer = request.cookies.user;
    let list = "updateassessment";

    const viewData = {
      assessment: member.assessments,
      member: member,
      bmi: gymutil.bmi(member),
      status: gymutil.goalstatus(member),
      idealweight: gymutil.idealweight(member),
      trainer: trainer,
      list: list
    };
    response.render("trainerassessment", viewData);
  },
  trainerGoals(request, response) {
    const memberId = request.params.id;
    const member = memberStore.getMember(memberId);
    response.cookie("member", member.id);
    const goals = member.goals;
    let status;
    if (member.goals.length >= 1) {
      status = gymutil.goalstatus(member);
    } else {
      status = "No Goal";
    }
    logger.debug("Member id = ", memberId);

    const viewData = {
      title: "Goals Dashboard",
      member: member,
      goals: goals,
      missed: gymutil.missed(member),
      open: gymutil.open(member),
      achieved: gymutil.achieved(member),
      bmi: gymutil.bmi(member),
      idealweight: gymutil.idealweight(member),
      status: status
    };
    response.render("trainergoals", viewData);
  },
  editComment(request, response) {
    const memberId = request.cookies.member;
    const member = memberStore.getMember(memberId);
    const assessment = memberStore.getAssessment(request.params.id);
    const assessmentid = request.params.id;
    const comment = request.body.comment;
    logger.debug("Add Comment to Assessment", comment);
    memberStore.addComment(assessmentid, memberId, comment);
    response.redirect("/trainerdashboard/" + memberId);
  },

  trainerGoal(request, response) {
    const memberId = request.cookies.member;
    const member = memberStore.getMember(memberId);
    if (member.goals.length >= 1) {
      let currentgoal = member.goals[0];
      let status = "";
      if (currentgoal.status !== "Achieved") {
        member.missed.unshift(currentgoal);
        status = "Missed";
      } else status = request.body.status;
      memberStore.updateStatus(currentgoal, status);
    }

    const Goal = {
      id: uuid.v1(),
      date: Number(request.body.date),
      weight: Number(request.body.weight),
      chest: Number(request.body.chest),
      upperarm: Number(request.body.upperarm),
      thigh: Number(request.body.thigh),
      waist: Number(request.body.waist),
      hips: Number(request.body.hips),
      status: "Open"
    };
    logger.debug("New Goal = ", Goal);
    if (member.current.length !== 0) {
      member.current.shift();
      member.current.unshift(Goal);
    }
    memberStore.addGoal(memberId, Goal);
    response.redirect("/trainerdashboard/" + memberId + "/trainergoals");
  }
};

module.exports = trainerdashboard;
