import { Mongo } from 'meteor/mongo';
import Report from './SpendingReport.js';

Meteor.methods({
    'logOrderInReport': function(ingredient, amount, price) {
        Report.insert({
            createdAt: Date.now(),
            ingredient_name: ingredient.name,
            quantity: Number(amount),
            price: price,
            type: "Ordered"
        });
    },
    'logProductionInReport': function(ingredient, amount, price) {
        console.log("log says:")
        console.log(ingredient)
        Report.insert({
            createdAt: Date.now(),
            ingredient_name: ingredient.name,
            quantity: Number(amount),
            price: price,
            type: "In Production"
        });
    }
});