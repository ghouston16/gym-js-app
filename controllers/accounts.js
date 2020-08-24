'use strict';

const userstore = require('../models/user-store');
const memberStore = require('../models/member-store');
const logger = require('../utils/logger');
const uuid = require('uuid');

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
        const user = request.body;
        user.id = uuid.v1();
        userstore.addUser(user);
        logger.info(`registering ${user.email}`);
        response.redirect('/');
    },

    authenticate(request, response) {
        const user = userstore.getUserByEmail(request.body.email);
        const member = memberStore.getUserByEmail(request.body.email);
        if (user) {
            response.cookie('member', user.email);
            logger.info(`logging in ${user.email}`);
            response.redirect('/dashboard');
        }
        else if (member){
                response.cookie('member', member.email);
                logger.info(`logging in ${member.email}`);
                response.redirect('/member/' + member.id);

            }
         else {
            response.redirect('/login');
        }
    },

    getCurrentUser(request) {
        const userEmail = request.cookies.member;
        return userstore.getUserByEmail(userEmail);
    },
};

module.exports = accounts;