'use strict';

const _ = require('lodash');
const userstore = require('../models/user-store');
const memberStore = require('../models/member-store');
const logger = require('../utils/logger');
const uuid = require('uuid');
const moment = require('moment')

const accounts = {

    index(request, response) {
        const viewData = {
            title: 'Login or Signup',
        };
        response.render('index', viewData);
    },

    login(request, response) {
        const viewData = {
            title: 'Login to the Service',
        };
        response.render('login', viewData);
    },

    logout(request, response) {
        response.cookie('member', '');
        response.redirect('/');
    },

    signup(request, response) {
        const viewData = {
            title: 'Login to the Service',
        };
        response.render('signup', viewData);
    },

    register(request, response) {
        const member = request.body;
        member.id = uuid.v1();
        member.assessments = [];
        memberStore.addMember(member);
        logger.info(`registering ${member.email}`);
        response.redirect('/');
    },

    authenticate(request, response) {
        const user = userstore.getUserByEmail(request.body.email);
        const member = memberStore.getUserByEmail(request.body.email);
        if  (user != undefined && request.body.password === user.password) {
            response.cookie('trainer', user);
            logger.info(`logging in ${user.email}`);
            response.redirect('/trainerdashboard');
    }
        else if (member !== undefined && request.body.password === member.password) {
                response.cookie('member', member.email);
                logger.info(`logging in ${member.email}`);
                response.redirect('/dashboard/' + member.id);
            }
         else {
            response.redirect('/login');
        }
    },
    settings(request, response) {
        const userEmail = request.cookies.member;
        let  loggedInUser = accounts.getCurrentUser(request);
         const viewData ={
             loggedInUser
         }

      /*  const genderboolean = (loggedInUser.gender === 'F' || loggedInUser.gender === 'Female') ? true : false

        loggedInUser.gender = (loggedInUser.gender === 'F' || loggedInUser.gender === 'Female') ? 'Female' : 'Male'

*/

        response.render('settings', viewData);
    },

    update(request, response) {

        const loggedInUser = accounts.getCurrentUser(request);
        const update = request.body;

        if (update.password != "" || update.address != "") {
            memberStore.updateSettings(loggedInUser, update)
        }

        response.redirect('/dashboard/:id')

    },
    getCurrentUser(request) {
        const userEmail = request.cookies.member;
        return memberStore.getUserByEmail(userEmail);
    },
};

module.exports = accounts;