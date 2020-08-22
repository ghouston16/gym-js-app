"use strict";

const logger = require("../utils/logger");
const memberStore = require("../models/member-store");
const uuid = require("uuid");

const member = {
  index(request, response) {
    const memberId = request.params.id;
    logger.debug("Member id = ", memberId);
    const viewData = {
      title: "Member",
      member: memberStore.getMember(memberId)
    };
    response.render("member", viewData);
  },

  deleteAssessment(request, response) {
    const memberId = request.params.id;
    const assessmentId = request.params.assessmentid;
    logger.debug(`Deleting Assessment ${assessmentId} from Member ${memberId}`);
    memberStore.removeAssessment(memberId, assessmentId);
    response.redirect("/member/" + memberId);
  },

  addAssessment(request, response) {
    const memberId = request.params.id;
    const member = memberStore.getMember(memberId);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    const newAssessment = {
      id: uuid.v1(),
      date: today,
      weight: Number(request.body.weight),
      chest: Number(request.body.chest),
      upperarm: Number(request.body.upperarm),
      thigh: Number(request.body.thigh),
      waist: Number(request.body.waist),
      hips: Number(request.body.hips)
    };
    logger.debug("New Assessment = ", newAssessment);
    memberStore.addAssessment(memberId, newAssessment);
    response.redirect("/member/" + memberId);
  }
};

module.exports = member;
