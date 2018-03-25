import { Mongo } from 'meteor/mongo';
import Lots from './Lots.js';

if (Meteor.isClient) {
    Meteor.subscribe('lots')
}

Meteor.methods({
    'lots.add': function(indID, qty, lot, vendor, price, time) {
        var lot = Lots.find({ingID : ingID}).fetch()
        var entry = {
           qty: qty,
            lot: lot,
            vendor: vendor,
            price: price,
            time: time 
        }

        if(lot.length != 0) {
            Lots.update({ingID : ingID}, {$push : {queue : entry}})
        }
        else {
            Lots.insert({
                ingID: ingID,
                queue: [entry]
            }]
        })
        }
    }
});