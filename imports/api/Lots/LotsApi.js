import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import Lots from './Lots.js';

if (Meteor.isClient) {
    Meteor.subscribe('lots')
}

Meteor.methods({
    'lots.add': function(ingID, qty, lotNumber, vendor, price, time) {
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
    }
});