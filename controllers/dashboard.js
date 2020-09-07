"use strict";

const logger = require("../utils/logger");
const memberStore = require("../models/member-store");
const uuid = require("uuid");
const gymutil = require("../utils/gymutility.js");
const accounts = require("./accounts.js");

const dashboard = {
  index(request, response) {
    const memberId = request.params.id;
    const loggedInUser = accounts.getCurrentUser(request);
    const assessment = loggedInUser.assessments;
    const goals = loggedInUser.goals;
    const missed = loggedInUser.missed.length;
    const open = loggedInUser.current.length;
    const achieved = loggedInUser.achieved.length;
    let status;
    if (goals.length >= 1) {
      status = gymutil.goalstatus(loggedInUser);
    } else {
      status = "No Goal";
    }
    logger.debug("Member id = ", loggedInUser);
    const viewData = {
      title: "Dashboard",
      member: loggedInUser,
      assessment: assessment,
      bmi: gymutil.bmi(loggedInUser),
      idealweight: gymutil.idealweight(loggedInUser),
      goals: goals,
      missed: missed,
      achieved: achieved,
      open: open,
      status: status
    };
    response.render("dashboard", viewData);
  },

  deleteAssessment(request, response) {
    const memberId = request.params.id;
    const assessmentId = request.params.assessmentid;
    logger.debug(`Deleting Assessment ${assessmentId} from Member ${memberId}`);
    memberStore.removeAssessment(memberId, assessmentId);
    response.redirect("/dashboard/" + memberId);
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const memberId = request.params.id;
    const member = memberStore.getMember(memberId);
    const assessment = loggedInUser.assessments;
    //TODO use moment or other tidier method for date - method from Stack-Overflow
    let today = new Date();
    let trend = false;
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + "/" + mm + "/" + dd;

    if (member.goals.length !== 0) {
      let currentgoal = member.goals[0];

      if (currentgoal != "") {
        if (currentgoal.weight != "" && currentgoal.weight > request.body.weight) {
          if (currentgoal.chest != "" && currentgoal.chest > request.body.chest) {
            if (currentgoal.thigh != "" && currentgoal.thigh > request.body.thigh) {
              if (currentgoal.upperarm != "" && currentgoal.upperarm > request.body.upperarm) {
                if (currentgoal.waist != "" && currentgoal.waist > request.body.waist) {
                  if (currentgoal.hips != "" && currentgoal.hips > request.body.hips) {
                  }
                }
              }
            }
          }
          member.achieved.unshift(currentgoal);
          let status = "Achieved";
          memberStore.updateStatus(currentgoal, status);
        }
      }
    }


    if (assessment.length > 1) {
      trend = assessment[0].weight > Number(request.body.weight);
    } else if (assessment.length < 1) {
      trend = member.startingWeight > Number(request.body.weight);
    }


    const newAssessment = {
      id: uuid.v1(),
      date: today,
      weight: Number(request.body.weight),
      chest: Number(request.body.chest),
      upperarm: Number(request.body.upperarm),
      thigh: Number(request.body.thigh),
      waist: Number(request.body.waist),
      hips: Number(request.body.hips),
      trend: trend,
      comment: request.body.comment
    };
    logger.debug("New Assessment = ", newAssessment);
    memberStore.addAssessment(memberId, newAssessment);
    response.redirect("/dashboard/" + memberId);
  },
  addGoal(request, response) {
    const memberId = request.params.id;
    const member = memberStore.getMember(memberId);
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + "/" + mm + "/" + dd;
    if (member.goals.length >= 1) {
      let currentgoal = member.goals[0];
      let status = "";
      if (currentgoal.status !== "Achieved") {
        member.missed.unshift(currentgoal);
        status = "Missed";
      } else status = request.body.status;
      memberStore.updateStatus(currentgoal, status);
    }
    const newGoal = {
      id: uuid.v1(),
      date: request.body.date,
      weight: Number(request.body.weight),
      chest: Number(request.body.chest),
      upperarm: Number(request.body.upperarm),
      thigh: Number(request.body.thigh),
      waist: Number(request.body.waist),
      hips: Number(request.body.hips),
      status: "Open"
    };
    logger.debug("New Goal = ", newGoal);
    memberStore.addGoal(memberId, newGoal);
    member.current.shift();
    member.current.unshift(newGoal);
    response.redirect("/dashboard/" + memberId + "/goals");
  },
  goals(request, response) {
    const goalId = request.params.id;
    const loggedInUser = accounts.getCurrentUser(request);
    const goals = loggedInUser.goals;
    let status;
    if (loggedInUser.goals.length >= 1) {
      status = gymutil.goalstatus(loggedInUser);
    } else {
      status = "No Goal";
    }
    logger.debug("Member id = ", loggedInUser);
    const viewData = {
      title: "Goals Dashboard",
      member: loggedInUser,
      goals: goals,
      missed: gymutil.missed(loggedInUser),
      open: gymutil.open(loggedInUser),
      achieved: gymutil.achieved(loggedInUser),
      bmi: gymutil.bmi(loggedInUser),
      idealweight: gymutil.idealweight(loggedInUser),
      status: status
    };
    response.render("goals", viewData);
  },

  deleteGoal(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const memberId = loggedInUser.id;
    const member = memberStore.getMember(memberId);
    const goalId = request.params.id;
    logger.debug(`Deleting Assessment ${goalId} from Member ${memberId}`);
    memberStore.removeGoal(memberId, goalId);
    response.redirect("/dashboard/" + memberId + "/goals");
  },
  update(request, response) {
    const memberId = request.params.id;
    const member = memberStore.getMember(memberId);
    const newMember = {
      email: request.body.email,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      password: request.body.password,
      gender: request.body.gender
    };
    logger.debug(`Updating Details ${memberId} `);
    memberStore.updateSettings(member, newMember);
    response.redirect("/dashboard/" + memberId);
  }
};

module.exports = dashboard;
