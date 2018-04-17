import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import FreshReport from './FreshReport.js';
import conversions from '../../utils/conversions.js'
import './FreshTotalApi.js'

if (Meteor.isClient) {
    Meteor.subscribe('lots')
    Meteor.subscribe('ingredients')
    Meteor.subscribe('intermediates')
    Meteor.subscribe('freshreport')
    Meteor.subscribe('freshtotal')
}

Meteor.methods({
    'freshreport.insert': function(id) {
        FreshReport.insert({
            inventoryID: id
        })
        // FreshReport.simpleSchema.clean()
    },
    'freshreport.insertFinalProduct': function(id) {
        FreshReport.insert({
            inventoryID: id,
            finalProduct: true
        })
    },
    'freshreport.updateAvgTime': function(id, qtyConsumed, finalProduct) {
        var repArr = FreshReport.find({ inventoryID : id}).fetch()
        if (repArr.length === 0) {
            if (finalProduct == false) {
                Meteor.call('freshreport.insert',id)
            }
            else {
                Meteor.call('freshreport.insertFinalProduct',id)
            }
            repArr = FreshReport.find({ inventoryID : id}).fetch()
        }
        var rep = repArr[0]
        // console.log(rep)
        var startDate = Lots.find({ inventoryID : id}).fetch()[0].queue[0].time
        var consumptionDate = new Date()
        // var hoursDiff = (consumptionDate = startDate)/(3600000)
        var millisecondsDiff = Number(consumptionDate - startDate)
        // console.log(millisecondsDiff)
        var newAvgTime = (millisecondsDiff * qtyConsumed + rep.totalTime)/(rep.totalQtyConsumed + qtyConsumed)
        // console.log(rep.totalQtyConsumed)
        FreshReport.update({ inventoryID : id},{$set : {avgTime : newAvgTime}})
        FreshReport.update({ inventoryID : id},{$inc : {totalTime : millisecondsDiff * qtyConsumed}})
        FreshReport.update({ inventoryID : id},{$inc : {totalQtyConsumed : qtyConsumed}})
        FreshReport.update({ inventoryID : id},{$set : {avgTimeString: conversions.dhm(newAvgTime)}})
        Meteor.call('freshtotal.updateAvgTime',qtyConsumed,millisecondsDiff,finalProduct)
        Meteor.call('freshreport.updateWorstCase',id, finalProduct)
    },
    'freshreport.updateWorstCase': function(id, finalProduct) {
        var repArr = FreshReport.find({ inventoryID : id}).fetch()
        if (repArr.length === 0) {
            Meteor.call('freshreport.insert',id)
            repArr = FreshReport.find({ inventoryID : id}).fetch()
        }
        var rep = repArr[0]
        var startDate = Lots.find({ inventoryID : id}).fetch()[0].queue[0].time
        var consumptionDate = new Date()
        if ((consumptionDate - startDate) > rep.worstCase) {
            FreshReport.update({ inventoryID : id},{$set : {worstCase: (consumptionDate - startDate)}})
            FreshReport.update({ inventoryID : id},{$set : {worstCaseString: conversions.dhm(consumptionDate - startDate)}})
        }
        Meteor.call('freshtotal.updateWorstCase', consumptionDate - startDate, finalProduct)
    }
});