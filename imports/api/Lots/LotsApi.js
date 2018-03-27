import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import Lots from './Lots.js';
import { LotNumberSystem } from './LotNumberSystem.js'
import '../FreshReport/FreshReportApi.js'

if (Meteor.isClient) {
    Meteor.subscribe('lots')
    Meteor.subscribe('ingredients')
    Meteor.subscribe('intermediates')
    Meteor.subscribe('freshreport')
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

        console.log(entry)

        if(lot.length != 0) {
            Lots.update({inventoryID : ingID}, {$push : {queue : entry}})
        }
        else {
            Lots.insert({
                inventoryID: ingID,
                queue: [entry]
            })
        }
        var curTotalNativeUnits = IngredientsList.find({ _id : ingID}).fetch()[0].nativeInfo.totalQuantity
        Meteor.call('editTotalNumNativeUnits',ingID,curTotalNativeUnits + qty)
    },
    'lots.addFormula': function(id, qty, lotNumber, time) {
        var lot = Lots.find({inventoryID : id}).fetch()
        var entry = {
            qty: qty,
            lot: lotNumber,
            time: time 
        }

        console.log(entry)

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
        // var curTotalNativeUnits = Intermediates.find({ _id : id}).fetch()[0].nativeInfo.totalQuantity khjh
        // Meteor.call('editTotalNumNativeUnits',id,curTotalNativeUnits + qty)
    },
    'lots.addArray': function(id, arr) {
        //TODO: Implement
    },
    'lots.editLots': function(id, arr) {
        Lots.find({inventoryID : id}).fetch()
    },
    'lots.removeQty': function(id, qty) {
        console.log('Removing '+qty+' native units from lots')
        var lot = Lots.find({inventoryID : id}).fetch()
        if (lot.length === 0) {
            throw new Meteor.Error('no lots fexist for ingredient','no lots exist for ingredient')
        }
        console.log(lot[0])
        var q = lot[0].queue
        while (true) {
            if (qty >= q[0].qty) {
                qty -= q[0].qty
                Meteor.call('freshreport.updateAvgTime',id,q[0].qty)
                Meteor.call('freshreport.updateWorstCase',id)
                q.shift()
            }
            else {
                q[0].qty = q[0].qty - qty
                Meteor.call('freshreport.updateAvgTime',id,q[0].qty)
                Meteor.call('freshreport.updateWorstCase',id)
                break
            }
        }
        Lots.update({inventoryID : id}, {$set : {queue : q}})
    },
    'lots.editLotNumber': function(id, oldLot, newLot, date) {
        date.setMilliseconds(0)
        var lot = Lots.find({ inventoryID : id}).fetch()[0]
        var q = lot.queue
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
                console.log('Goal condition reached!')
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
        var curTotalNativeUnits = IngredientsList.find({ _id : id}).fetch()[0].nativeInfo.totalQuantity
        console.log('total # native units: '+curTotalNativeUnits)
        console.log('inventory difference is: '+(curTotalNativeUnits - diff))
        Meteor.call('editTotalNumNativeUnits',id,curTotalNativeUnits - diff)
    },
    'lots.increaseSystemLot'(){
        LotNumberSystem.update({ name : 'system'},{$inc : {lotNumber : 1}})
    }
});