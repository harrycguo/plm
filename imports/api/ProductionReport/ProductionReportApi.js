import { Mongo } from 'meteor/mongo';
import ProductionReport from './ProductionReport.js';
import { Formulas } from '../Formulas/formulas.js';

Meteor.methods({
    'production.log': function(formula, qty) {
        console.log(Formulas.find().fetch())
        if (ProductionReport.find({ formula : formula }).fetch().length === 0) {
            formula = Formulas.find({ _id : formula}).fetch()[0]
            ingList = []
            for (var i = 0; i < formula.ingList.length; i++) {
                ingList.push({
                    ingredient: formula.ingList[i].ingredient,
                    totalNativeUnitsConsumed: formula.ingList[i].amount
                })
            }
            ProductionReport.insert({
              formula: formula,
              totalProduced: qty,
              ingredientsUsed: ingList
            });  
        }
        else {
            ProductionReport.update( {formula : formula}, {$inc : { total : qty}})
            ingList = Formulas.find({ _id : formula}).fetch()[0]
            for (var i = 0; i < ingList.length; i++) {
                ProductionReport.update({formula:formula, 'ingredientsUsed.ingredient':ingList[i].id}, {$inc : {'ingredientsUsed.$.totalNativeUnitsConsumed' : ingList[i].amount}})
            }
        }
    }
});