'use strict';

const accounts = require('../controllers/accounts');
const dashboard = require('../controllers/trainerdashboard');
const memberStore = require('../models/member-store');
const moment = require('moment');
const _ = require('lodash');

const utility = {
    bmi(loggedInUser) {
        const assessment = loggedInUser.assessments;

        const lastassessment = assessment[0]

        let weight = loggedInUser.startingWeight;
        if (assessment != "") {
            weight = lastassessment.weight;
        }
        const height = (loggedInUser.height/100);
        const bmi = (weight / (height * height)).toFixed(2);
        let bmicategory = null;

        if (bmi < 16) {
            bmicategory = "SEVERELY UNDERWEIGHT"
        } else if (bmi >= 16 && bmi < 18.5) {
            bmicategory = "UNDERWEIGHT"
        } else if (bmi >= 18.5 && bmi < 25) {
            bmicategory = "NORMAL"
        } else if (bmi >= 25 && bmi < 30) {
            bmicategory = "OVERWEIGHT"
        } else if (bmi >= 30 && bmi < 35) {
            bmicategory = "MODERATELY OBESE"
        } else {
            bmicategory = "SEVERELY OBESE"
        }
        return {
            bmi,
            bmicategory
        };
    },

 /*   goal(loggedInUser) {
        let goal = loggedInUser.goals.filter(date => (date.date))
        if(goal !=""){
            goal = _.sortBy(goal, function(o) {
                return new moment(o.date)
            }).reverse();

            return goal[0].status
        }else{

            return
        }
    },
*/
    idealweight(loggedInUser, idealweight) {

        let weight = loggedInUser.startingWeight;
        const height = loggedInUser.height;
        const gender = loggedInUser.gender.substring(0, 0);
        const assessment = loggedInUser.assessments;
        const lastassessment = assessment[0]


        if (assessment !="") {
            weight = lastassessment.weight;
        }

        let base = null;

        if ((gender === "M")||(gender === "m")) {
            base = 50
        } else {
            base = 45.5
        }
        idealweight = base + 2.3 * ((height / 0.0254) - 60)


        if (weight <= idealweight) {
            return true;
        } else {
            return false
        }
    },

 /*   goalstatus() {


    },

*/
};
module.exports = utility;