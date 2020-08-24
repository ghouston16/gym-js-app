"use strict";

const logger = require("../utils/logger");
const memberStore = require("../models/member-store");
const uuid = require("uuid");
const accounts = require ('./accounts.js');

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const viewData = {
      title: "Dashboard",
      members: memberStore.getAllMembers()
    };
    logger.info("about to render", memberStore.getAllMembers());
    response.render("dashboard", viewData);
  },

  deleteMember(request, response) {
    const memberId = request.params.id;
    logger.debug(`Deleting member ${memberId}`);
    memberStore.removeMember(memberId);
    response.redirect("/dashboard");
  },

  addMember(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
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
  }
};

module.exports = dashboard;
