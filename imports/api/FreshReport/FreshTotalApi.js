import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import FreshTotal from './FreshTotal.js';
import conversions from '../../utils/conversions.js'

if (Meteor.isClient) {
    Meteor.subscribe('lots')
    Meteor.subscribe('freshreport')
    Meteor.subscribe('freshtotal')
}

Meteor.methods({
    'freshtotal.insert': function() {
        FreshTotal.insert({})
        // FreshReport.simpleSchema.clean()
    },
    'freshtotal.updateAvgTime': function(qtyConsumed, time) {
        var repArr = FreshTotal.find().fetch()
        if (repArr.length === 0) {
            Meteor.call('freshtotal.insert')
            repArr = FreshTotal.find().fetch()
        }
        var rep = repArr[0]
        // console.log(rep)
        var newAvgTime = (time * qtyConsumed + rep.totalTime)/(rep.totalConsumed + qtyConsumed)
        // console.log(rep.totalConsumed)
        FreshTotal.update({},{$set : {avgTime : newAvgTime}})
        FreshTotal.update({},{$inc : {totalTime : time}})
        FreshTotal.update({},{$inc : {totalConsumed : qtyConsumed}})
        FreshTotal.update({},{$set : {avgTimeString: conversions.dhm(newAvgTime)}})
    },
    'freshtotal.updateWorstCase': function(time) {
        var repArr = FreshTotal.find().fetch()
        if (repArr.length === 0) {
            Meteor.call('freshtotal.insert')
            repArr = FreshTotal.find().fetch()
        }
        var rep = repArr[0]
        if (time > rep.worstCase) {
            FreshTotal.update({},{$set : {worstCase: time}})
            FreshTotal.update({},{$set : {worstCaseString: conversions.dhm(time)}})
        }
    }
});