"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const memberStore = {
  store: new JsonStore("./models/member-store.json", {
    memberCollection: []
  }),
  collection: "memberCollection",

  getAllMembers() {
    return this.store.findAll(this.collection);
  },

  getMember(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  addMember(member) {
    this.store.add(this.collection, member);
    this.store.save();
  },

  removeMember(id) {
    const member = this.getMember(id);
    this.store.remove(this.collection, member);
    this.store.save();
  },

  removeAllMembers() {
    this.store.removeAll(this.collection);
    this.store.save();
  },
  getAssessment(id) {
    const test = this.store.findOneBy(this.collection, { id: id });
    return this.store.findOneBy('memberStore.assessments', { id: id });
  },
  getGoal(id) {
    const test = this.store.findOneBy(this.collection, { id: id });
    return this.store.findOneBy('memberStore.goals', { id: id });
  },


  addAssessment(id, assessment) {
    const member = this.getMember(id);
    member.assessments.unshift(assessment);
    this.store.save();
  },

  addGoal(id, goal) {
    const member = this.getMember(id);
    member.goals.unshift(goal);
    this.store.save();
  },
  removeGoal(id, goalId) {
    const member = this.getMember(id);
    const goals = member.goals;
    _.remove(goals, { id: goalId });
    this.store.save();
  },

  addComment(id, memberId, comment) {
    const user = this.getMember(memberId)
    const assessment = user.assessments;
    const update = assessment.map(i=> i.id).indexOf(id);
    assessment[update].comments = comment;
    this.store.save();
  },


  removeAssessment(id, assessmentId) {
    const member = this.getMember(id);
    const assessments = member.assessments;
    _.remove(assessments, { id: assessmentId });
    this.store.save();
  },
  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },
  updateSettings(member, update){
      if(update.password !="") member.password = update.password;
      if(update.address !="") member.address = update.address;
      this.store.save();
    },
};

module.exports = memberStore;
