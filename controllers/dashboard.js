"use strict";

const logger = require("../utils/logger");
const memberStore = require("../models/member-store");
const uuid = require("uuid");
const gymutil = require('../utils/gymutility.js');
const accounts = require("./accounts.js");

const dashboard = {
    index(request, response) {
        const memberId = request.params.id;
        const loggedInUser = accounts.getCurrentUser(request);
        const assessment = loggedInUser.assessments;
        logger.debug("Member id = ", loggedInUser);
        const viewData = {
            title: "Dashboard",
            member: loggedInUser,
            assessment: assessment,
            bmi: gymutil.bmi(loggedInUser),
            idealweight: gymutil.idealweight(loggedInUser)
        };
        response.render("Dashboard", viewData);
    },

    deleteAssessment(request, response) {
        const memberId = request.params.id;
        const assessmentId = request.params.assessmentid;
        logger.debug(`Deleting Assessment ${assessmentId} from Member ${memberId}`);
        memberStore.removeAssessment(memberId, assessmentId);
        response.redirect("/dashboard/" + memberId);
    },

    addAssessment(request, response) {
        const memberId = request.params.id;
        const member = memberStore.getMember(memberId);
        let trend = false;
        //TODO use moment or other tidier method for date - method from Stack-Overflow
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        let yyyy = today.getFullYear();
        today = mm + "/" + dd + "/" + yyyy;
        if (member.assessments != null) {
            trend = member.assessments[0] > Number(request.body.weight);
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
        //TODO use moment or other tidier method for date - method from Stack-Overflow
        const newGoal = {
            id: uuid.v1(),
            date: Number(request.body.date),
            weight: Number(request.body.weight),
            chest: Number(request.body.chest),
            upperarm: Number(request.body.upperarm),
            thigh: Number(request.body.thigh),
            waist: Number(request.body.waist),
            hips: Number(request.body.hips),
        };
        logger.debug("New Goal = ", newGoal);
        memberStore.addGoal(memberId, newGoal);
        response.redirect("/dashboard/" + memberId + "/goals");
    },
    goals (request, response){
        const goalId = request.params.id;
        const loggedInUser = accounts.getCurrentUser(request);
        const goals = loggedInUser.goals;
        logger.debug("Member id = ", loggedInUser);
        const viewData = {
            title: "Goals Dashboard",
            member: loggedInUser,
            goals: goals,
            bmi: gymutil.bmi(loggedInUser),
            idealweight: gymutil.idealweight(loggedInUser)
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
        const member = memberStore.getMember(memberId)
        const newMember = {
            email: request.body.email,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            password: request.body.password,
            gender: request.body.gender,
        };
        logger.debug(`Updating Details ${memberId} `);
        memberStore.updateSettings(member, newMember);
        response.redirect("/dashboard/" + memberId);
    }
};

module.exports = dashboard;
