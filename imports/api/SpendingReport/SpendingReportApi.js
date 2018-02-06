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
    'logProductionInReport': function(ingredient, amount) {
        Report.insert({
            createdAt: Date.now(),
            ingredient_name: ingredient.name,
            quantity: Number(amount),
            price: ingredient.price,
            type: "In Production"
        });
    }
});