import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import RecallReport from './RecallReport.js';
import { dhm } from '../../utils/conversions.js'

if (Meteor.isClient) {
    Meteor.subscribe('lots')
    Meteor.subscribe('ingredients')
    Meteor.subscribe('intermediates')
    Meteor.subscribe('freshreport')
}

Meteor.methods({

});