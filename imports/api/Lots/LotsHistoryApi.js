import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import LotsHistory from './LotsHistory.js';
import { LotNumberSystem } from './LotNumberSystem.js'
import '../FreshReport/FreshReportApi.js'
import { Intermediates } from '../Intermediates/intermediates.js'

if (Meteor.isClient) {
    Meteor.subscribe('lots')
    Meteor.subscribe('ingredients')
    Meteor.subscribe('intermediates')
    Meteor.subscribe('freshreport')
    Meteor.subscribe('lotshistory')
}

Meteor.methods({
   'lotshistory.add': function(ingID, qty, lotNumber, vendor, price, time) {
        console.log('SUP BRUHHHHHHH')
        time.setMilliseconds(0)
        var lot = LotsHistory.find({inventoryID : ingID}).fetch()
        var entry = {
            qty: qty,
            lot: lotNumber,
            vendor: vendor,
            price: price,
            time: time,
            productionHistory: []
        }

        // console.log(entry)

        if(lot.length != 0) {
            LotsHistory.update({inventoryID : ingID}, {$push : {queue : entry}})
        }
        else {
            LotsHistory.insert({
                inventoryID: ingID,
                queue: [entry]
            })
        }
        console.log('created history: '+time)
   },
   'lotshistory.addFormula': function(id, qty, lotNumber, time) {
        time.setMilliseconds(0)
        var lot = LotsHistory.find({inventoryID : id}).fetch()
        var entry = {
            qty: qty,
            lot: lotNumber,
            time: time,
            productionHistory: []
        }

        // console.log(entry)

        

        if(lot.length != 0) {
            LotsHistory.update({inventoryID : id}, {$push : {queue : entry}})
        }
        else {
            LotsHistory.insert({
                inventoryID: id,
                queue: [entry]
            })
        }
        // var curTotalNativeUnits = Intermediates.find({ _id : id}).fetch()[0].nativeInfo.totalQuantity
        // Meteor.call('editTotalNumNativeUnits',id,curTotalNativeUnits + qty)
    },
    'lotshistory.update': function(id, qty, lotEntry, entry) {
        var lot = LotsHistory.find({ inventoryID : id}).fetch()[0]
        var q = lot.queue
        var prodHist = []
        var time = new Date()
        for (var i = 0; i < q.length; i++) {
            console.log('wut it do: '+q[i].lot == lotEntry.lot)
            if (q[i].lot == lotEntry.lot && q[i].time.getTime() === lotEntry.time.getTime()) {
                prodHist = q[i].productionHistory
                time = q[i].time
                console.log('FOUND OR NAH!?')
            }
        }
        console.log(lotEntry)
        prodHist.push(entry)
        if(lot.length == 0) {
            LotsHistory.insert({
                inventoryID: id,
                queue: [entry]
            })
        }
        LotsHistory.update({ inventoryID : id, 'queue.time': time},{$set : {'queue.$.productionHistory' : prodHist}})
    },
    'lotshistory.updateNameTopLevel': function(id,intermediate) {
        var lot = LotsHistory.find({ inventoryID : id}).fetch()[0]
        var q = lot.queue
    }
});