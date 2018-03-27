import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import Lots from './Lots.js';
import { LotNumberSystem } from './LotNumberSystem.js'
import '../FreshReport/FreshReportApi.js'
import { Intermediates } from '../Intermediates/intermediates.js'
import './LotsHistoryApi.js'

if (Meteor.isClient) {
    Meteor.subscribe('lots')
    Meteor.subscribe('ingredients')
    Meteor.subscribe('intermediates')
    Meteor.subscribe('freshreport')
    Meteor.subscribe('lotshistory')
}

Meteor.methods({
    'lots.add': function(ingID, qty, lotNumber, vendor, price, time) {
        //Make it so that editing lot uantities is the only way that ingredient stock quantity total is able to be edited
        time.setMilliseconds(0)
        var lot = Lots.find({inventoryID : ingID}).fetch()
        var entry = {
            qty: qty,
            lot: lotNumber,
            vendor: vendor,
            price: price,
            time: time
        }

        if(lot.length != 0) {
            Lots.update({inventoryID : ingID}, {$push : {queue : entry}})
        }
        else {
            Lots.insert({
                inventoryID: ingID,
                queue: [entry]
            })
        }
        console.log('created: '+time)
        var curTotalNativeUnits = IngredientsList.find({ _id : ingID}).fetch()[0].nativeInfo.totalQuantity
        Meteor.call('editTotalNumNativeUnits',ingID,curTotalNativeUnits + qty)
        Meteor.call('lotshistory.add', ingID, qty, lotNumber, vendor, price, time)
    },
    'lots.addFormula': function(id, qty, lotNumber, time) {
        time.setMilliseconds(0)
        var lot = Lots.find({inventoryID : id}).fetch()
        var entry = {
            qty: qty,
            lot: lotNumber,
            time: time
        }

        // console.log(entry)

        Meteor.call('lots.increaseSystemLot')

        if(lot.length != 0) {
            Lots.update({inventoryID : id}, {$push : {queue : entry}})
        }
        else {
            Lots.insert({
                inventoryID: id,
                queue: [entry]
            })
        }
        Meteor.call('lotshistory.addFormula', id, qty, lotNumber, time)
        // var curTotalNativeUnits = Intermediates.find({ _id : id}).fetch()[0].nativeInfo.totalQuantity
        // Meteor.call('editTotalNumNativeUnits',id,curTotalNativeUnits + qty)
    },
    'lots.removeQty': function(id, qty, formulaID, formulaQty, time, lotNum, intermediate) {
        console.log('Removing '+qty+' native units from lots')
        var lot = Lots.find({inventoryID : id}).fetch()
        var entry = {}
        if (lot.length === 0) {
            throw new Meteor.Error('no lots exist for ingredient','no lots exist for ingredient')
        }
        var q = lot[0].queue
        while (true) {
            if (qty >= q[0].qty) {
                qty -= q[0].qty
                Meteor.call('freshreport.updateAvgTime',id,q[0].qty)
                Meteor.call('freshreport.updateWorstCase',id)
                entry = {
                    inventoryID: formulaID,
                    qty: formulaQty,
                    time: time,
                    lot:lotNum,
                    intermediate: intermediate,
                    qtyConsumed: q[0].qty
                }
                Meteor.call('lotshistory.update',id,q[0].qty,q[0],entry)
                q.shift()
            }
            else {
                q[0].qty = q[0].qty - qty
                Meteor.call('freshreport.updateAvgTime',id,qty)
                Meteor.call('freshreport.updateWorstCase',id)
                entry = {
                    inventoryID: formulaID,
                    qty: formulaQty,
                    time: time,
                    lot:lotNum,
                    intermediate: intermediate,
                    qtyConsumed: qty
                }
                Meteor.call('lotshistory.update',id,qty,q[0],entry)
                break
            }
        }
        Lots.update({inventoryID : id}, {$set : {queue : q}})
    },
    'lots.editLotNumber': function(id, oldLot, newLot, date) {
        date.setMilliseconds(0)
        var lot = Lots.find({ inventoryID : id}).fetch()[0]
        var q = lot.queue
        for (var i = 0; i < q.length; i++) {
            q[i].time.setMilliseconds(0)
            if (q[i].lot == newLot && q[i].time.getTime() !== date.getTime() && q[i].vendor === undefined) {
                throw new Meteor.Error('intermediate already exists with this lot number','intermediate already exists with this lot number')
            }
        }
        q.forEach(function(lotEntry) {
            lotEntry.time.setMilliseconds(0)
            if (lotEntry.time.getTime() === date.getTime() && lotEntry.lot == oldLot) {
                lotEntry.lot = newLot
            }
        })
        Lots.update({ inventoryID : id },{$set : {queue : q}})
    },
    'lots.editLotQty': function(id, lotNumber, newQty, date) {
        date.setMilliseconds(0)
        var lot = Lots.find({ inventoryID : id}).fetch()[0]
        var q = lot.queue
        var diff = 0
        var index = 0
        for (var i = 0; i < q.length; i++) {
            q[i].time.setMilliseconds(0)
            if (q[i].time.getTime() === date.getTime() && q[i].lot == lotNumber) {
                index = i
                diff = q[i].qty - newQty
                q[i].qty = newQty
                break
            }
        }
        if (newQty == 0) {
            q.splice(index,1)
        }
        Lots.update({ inventoryID : id},{$set : {queue : q}})
        var curTotalNativeUnits = 0
        // console.log(lot.queue[0].vendor)
        if (lot.queue[0].vendor !== undefined) {
            curTotalNativeUnits = IngredientsList.find({ _id : id}).fetch()[0].nativeInfo.totalQuantity
            Meteor.call('editTotalNumNativeUnits',id,curTotalNativeUnits - diff)
        }
        else {
            curTotalNativeUnits = Intermediates.find({ _id : id}).fetch()[0].nativeInfo.totalQuantity
            Meteor.call('intermediates.editTotalNumNativeUnits',id,curTotalNativeUnits - diff)
        }
    },
    'lots.logProduction': function(lotID, id, qty, time, lot, intermediate) {
        var entry = {
            inventoryID: id,
            qty:qty,
            time: time,
            lot: lot,
            intermediate: intermediate
        }
        var lot = Lots.find({ inventoryID : lotID}).fetch()
        var q = lot[0].queue
    },
    'lots.increaseSystemLot'(){
        LotNumberSystem.update({ name : 'system'},{$inc : {lotNumber : 1}})
    },
    'lots.addToSystem'(number){
        LotNumberSystem.insert({lot: number})
    }
});