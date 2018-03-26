import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import Lots from './Lots.js';

if (Meteor.isClient) {
    Meteor.subscribe('lots')
    Meteor.subscribe('ingredients')
}

Meteor.methods({
    'lots.add': function(ingID, qty, lotNumber, vendor, price, time) { //Handle case for intermediates and products
        var lot = Lots.find({ingID : ingID}).fetch()
        var entry = {
            qty: qty,
            lot: lotNumber,
            vendor: vendor,
            price: price,
            time: time 
        }

        console.log(entry)

        if(lot.length != 0) {
            Lots.update({ingID : ingID}, {$push : {queue : entry}})
        }
        else {
            Lots.insert({
                ingID: ingID,
                queue: [entry]
            })
        }
    },
    'lots.addFormula': function(id, qty, lotNumber, time) {
        var lot = Lots.find({ingID : id}).fetch()
        var entry = {
            qty: qty,
            lot: lotNumber,
            time: time 
        }

        console.log(entry)

        if(lot.length != 0) {
            Lots.update({ingID : id}, {$push : {queue : entry}})
        }
        else {
            Lots.insert({
                ingID: id,
                queue: [entry]
            })
        }
    },
    'lots.remove': function(ingID, qty) {
        console.log('Removing '+qty+' native units from lots')
        var lot = Lots.find({ingID : ingID}).fetch()
        console.log(lot[0])
        var q = lot[0].queue
        while (true) {
            if (qty >= q[0].qty) {
                qty -= q[0].qty
                q.shift()
            }
            else {
                q[0].qty = q[0].qty - qty
                break
            }
        }
        Lots.update({ingID : ingID}, {$set : {queue : q}})
    },
    'lots.editLotNumber': function(ingID, oldLot, newLot) {
        var lot = Lots.find({ ingID : ingID}).fetch()[0]
        var q = lot.queue
        q.forEach(function(lotEntry) {
            if (lotEntry.lot == oldLot) {
                lotEntry.lot = newLot
            }
        })
        Lots.update({ ingID : ingID },{$set : {queue : q}})
    },
    'lots.editLotQty': function(ingID, lotNumber, newQty) {
        var lot = Lots.find({ ingID : ingID}).fetch()[0]
        var q = lot.queue
        var diff = 0
        q.forEach(function(lotEntry) {
            if (lotEntry.lot == lotNumber) {
                diff = lotEntry.qty - newQty
                lotEntry.qty = newQty
                console.log('difference is: '+diff)
            }
        })
        Lots.update({ ingID : ingID},{$set : {queue : q}})
        var curTotalNativeUnits = IngredientsList.find({ _id : ingID}).fetch()[0].nativeInfo.totalQuantity
        console.log('total # native units: '+curTotalNativeUnits)
        console.log('inventory difference is: '+(curTotalNativeUnits - diff))
        Meteor.call('editTotalNumNativeUnits',ingID,curTotalNativeUnits - diff)
    }
});