import { Mongo } from 'meteor/mongo';
import ProductionReport from './ProductionReport.js';

Meteor.methods({
    'production.log': function(formula, qty) {
        if (ProductionReport.find({ formula : formula }).fetch().length === 0) {
           ProductionReport.insert({
             formula: formula,
             total: qty
           });  
        }
        else {
            ProductionReport.update( {formula : formula}, {$inc : { total : qty}})
        }
    }
});