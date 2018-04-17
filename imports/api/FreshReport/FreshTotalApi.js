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
    'freshtotal.updateAvgTime': function(qtyConsumed, time, finalProduct) {
        var repArr = FreshTotal.find().fetch()
        if (repArr.length === 0) {
            Meteor.call('freshtotal.insert')
            repArr = FreshTotal.find().fetch()
        }
        var rep = repArr[0]
        // console.log(rep)
        var newAvgTime = (time * qtyConsumed + rep.totalTime)/(rep.totalConsumed + qtyConsumed)
        // console.log(rep.totalConsumed)
        FreshTotal.update({finalProduct : finalProduct},{$set : {avgTime : newAvgTime}})
        FreshTotal.update({finalProduct : finalProduct},{$inc : {totalTime : time}})
        FreshTotal.update({finalProduct : finalProduct},{$inc : {totalConsumed : qtyConsumed}})
        FreshTotal.update({finalProduct : finalProduct},{$set : {avgTimeString: conversions.dhm(newAvgTime)}})
    },
    'freshtotal.updateWorstCase': function(time, finalProduct) {
        var repArr = FreshTotal.find().fetch()
        if (repArr.length === 0) {
            Meteor.call('freshtotal.insert')
            repArr = FreshTotal.find().fetch()
        }
        var rep = repArr[0]
        if (time > rep.worstCase) {
            FreshTotal.update({finalProduct : finalProduct},{$set : {worstCase: time}})
            FreshTotal.update({finalProduct : finalProduct},{$set : {worstCaseString: conversions.dhm(time)}})
        }
    }
});