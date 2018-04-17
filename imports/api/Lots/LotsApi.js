import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import Lots from './Lots.js';
import { LotNumberSystem } from './LotNumberSystem.js'
import '../FreshReport/FreshReportApi.js'
import { Intermediates } from '../Intermediates/intermediates.js'
import './LotsHistoryApi.js'
import '../ProfitabilityReport/ProfReportApi.js'
import Formulas from '../Formulas/formulas.js'
import '../Formulas/formulas.js'

if (Meteor.isClient) {
    Meteor.subscribe('lots')
    Meteor.subscribe('ingredients')
    Meteor.subscribe('intermediates')
    Meteor.subscribe('freshreport')
    Meteor.subscribe('lotshistory')
    Meteor.subscribe('formulas')
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

        var curTotalNativeUnits = IngredientsList.find({ _id : ingID}).fetch()[0].nativeInfo.totalQuantity
        Meteor.call('editTotalNumNativeUnits',ingID,curTotalNativeUnits + qty)

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

        Meteor.call('systemlog.insert', "Lot", lotNumber, 0, "Added", "")
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
        Meteor.call('systemlog.insert', "Lot", lotNumber, 0, "Added", "")
        Meteor.call('lotshistory.addFormula', id, qty, lotNumber, time)
        // var curTotalNativeUnits = Intermediates.find({ _id : id}).fetch()[0].nativeInfo.totalQuantity
        // Meteor.call('editTotalNumNativeUnits',id,curTotalNativeUnits + qty)
    },
    'lots.addArray': function(id, arr) {
        //TODO: Implement
        Meteor.call('systemlog.insert', "Lot", "Multiple", 0, "Added", "")
    },
    'lots.editLots': function(id, arr) {
        Lots.find({inventoryID : id}).fetch()
    },
    'lots.removeQty': function(id, qty, formulaID, formulaQty, time, lotNum, intermediate) {
        var lot = Lots.find({inventoryID : id}).fetch()
        var entry = {}
        if (lot.length === 0) {
            throw new Meteor.Error('no lots exist for ingredient','no lots exist for ingredient')
        }
        var q = lot[0].queue
       
        while (true) {
            if (qty >= q[0].qty) {
                qty -= q[0].qty
                Meteor.call('freshreport.updateAvgTime',id,q[0].qty, false)
                console.log(q)
                entry = {
                    inventoryID: formulaID,
                    qty: formulaQty,
                    qtyConsumed: q[0].qty,
                    time: time,
                    lot:lotNum,
                    intermediate: intermediate
                    
                }
                console.log("reaching here")
                Meteor.call('lotshistory.update',id,q[0].qty,q[0],entry)
                Meteor.call('systemlog.insert', "Lot", q[0].lot, 0, "Removed", q[0].qty)
                q.shift()
            }
            else {
                q[0].qty = q[0].qty - qty
                Meteor.call('freshreport.updateAvgTime',id,qty,false)
                entry = {
                    inventoryID: formulaID,
                    qty: formulaQty,
                    qtyConsumed: qty,
                    time: time,
                    lot:lotNum,
                    intermediate: intermediate
                }
                console.log("reaching here")
                Meteor.call('lotshistory.update',id,qty,q[0],entry)
                Meteor.call('systemlog.insert', "Lot", q[0].lot, 0, "Removed", qty)
                break
            }
        }
        Lots.update({inventoryID : id}, {$set : {queue : q}})
        Meteor.call('systemlog.insert', "Lot", lotNum, 0, "Removed", qty)
    },
    //To be called only when final products are sold
    'lots.removeQtyFinalProduct': function(id, qty, price) {
        var lot = Lots.find({inventoryID : id}).fetch()
        var entry = {}
        if (lot.length === 0) {
            throw new Meteor.Error('no lots exist for ingredient','no lots exist for ingredient')
        }
        var q = lot[0].queue
        let startingQty = qty
       
        sum = 0
        q.forEach(function(lotEntry) {
            sum += lotEntry.qty
        })

        if (qty > sum) {
            throw new Meteor.Error('not enough inventory for sale','not enough inventory for sale')
        }

        while (true) {
            console.log(q)
            if (qty >= q[0].qty) {
                qty -= q[0].qty
                Meteor.call('freshreport.updateAvgTime',id,q[0].qty, true)
                Meteor.call('systemlog.insert', "Lot", q[0].lot, 0, "Removed", q[0].qty)
                q.shift()
            }
            else {
                q[0].qty = q[0].qty - qty
                Meteor.call('freshreport.updateAvgTime',id,qty, true)
                Meteor.call('systemlog.insert', "Lot", q[0].lot, 0, "Removed", qty)
                break
            }
            if (q.length == 0) {
                break
            }
        }
        Lots.update({inventoryID : id}, {$set : {queue : q}})
        // let formula = Formulas.find({ _id : id}).fetch()[0]
        Formulas.update({ _id : id},{$inc : {quantity : -startingQty}})
        Meteor.call('profreport.updateAvgWholesalePrice',id, price, qty)
        // Meteor.call('systemlog.insert', "Lot", lotNum, 0, "Removed", qty)
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
        Meteor.call('systemlog.insert', "Lot", oldLot, 0, "Modified", newLot)
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
        Lots.update({ inventoryID : id},{$set : {queue : q}})
        Meteor.call('systemlog.insert', "Lot", lotNumber, 0, "Modified", newQty)
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