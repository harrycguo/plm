import { Mongo } from 'meteor/mongo';
import ProductionReport from './ProductionReport.js';
import { Formulas } from '../Formulas/formulas.js';

Meteor.methods({
    'production.log': function(formulaId, qty) {
        console.log(Formulas.find().fetch())
        if (ProductionReport.find({ formula : formulaId }).fetch().length === 0) {
            var formula = Formulas.find({ _id : formulaId}).fetch()[0]
            ingList = []
            for (var i = 0; i < formula.ingList.length; i++) {
                var ing = IngredientsList.find({ _id : formula.ingList[i].ingredient}).fetch()[0]
                ingList.push({
                    ingredient: formula.ingList[i].ingredient,
                    totalCost: (((formula.ingList[i].amount * qty)/ing.nativeInfo.numNativeUnitsPerPackage) * ing.spendingInfo.avgPrice),
                    totalUnitsConsumed: (formula.ingList[i].amount * qty)
                })
            }
            ProductionReport.insert({
              formula: formula,
              totalProduced: qty,
              ingredientsUsed: ingList
            });  
        }
        else {
            ProductionReport.update( {formula : formulaId}, {$inc : { totalProduced : qty}})
            ingList = Formulas.find({ _id : formulaId}).fetch()[0]
            for (var i = 0; i < ingList.length; i++) {
                ProductionReport.update({formula:formulaId, 'ingredientsUsed.ingredient':ingList[i].id}, {$inc : {'ingredientsUsed.$.totalUnitsConsumed' : ingList[i].amount}})
            }
        }
    }
});