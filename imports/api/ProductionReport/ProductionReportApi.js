import { Mongo } from 'meteor/mongo';
import ProductionReport from './ProductionReport.js';
import { Formulas } from '../Formulas/formulas.js';

if (Meteor.isClient) {
    Meteor.subscribe('prodReport')
}

Meteor.methods({
    'production.log': function(formulaId, qty) {
        console.log(Formulas.find().fetch())
        if (ProductionReport.find({ formula : formulaId }).fetch().length === 0) {
            var formula = Formulas.find({ _id : formulaId}).fetch()[0]
            ingList = []
            for (var i = 0; i < formula.ingredientsList.length; i++) {
                var ing = IngredientsList.find({ _id : formula.ingredientsList[i].id}).fetch()[0]
                ingList.push({
                    ingredient: formula.ingredientsList[i].id,
                    totalCost: (((formula.ingredientsList[i].amount * qty)/ing.nativeInfo.numNativeUnitsPerPackage) * ing.spendingInfo.avgPrice),
                    totalUnitsConsumed: formula.ingredientsList[i].amount * (qty/formula.productUnits)
                })
            }
            ProductionReport.insert({
              formula: formulaId,
              totalProduced: qty,
              ingredientsUsed: ingList
            });  
        }
        else {
            ProductionReport.update( {formula : formulaId}, {$inc : { totalProduced : qty}})
            console.log('We made it niggas')
            var formula = Formulas.find({ _id : formulaId}).fetch()[0]
            ingList = formula.ingredientsList
            console.log(ingList)
            for (var i = 0; i < ingList.length; i++) {
                var ing = IngredientsList.find({ _id : ingList[i].id}).fetch()[0]
                var rep = ProductionReport.find({formula:formulaId}).fetch()[0]
                for (var j = 0; j < rep.ingredientsUsed.length; j++) {
                    if (rep.ingredientsUsed[j].ingredient == ingList[i].id) {
                        console.log('MADE IT TO THE EPICENTER')
                        ProductionReport.update({formula:formulaId, 'ingredientsUsed.ingredient':ingList[i].id}, {$inc : {'ingredientsUsed.$.totalUnitsConsumed' : ingList[i].amount * (qty/formula.productUnits)}})
                        ProductionReport.update({formula:formulaId, 'ingredientsUsed.ingredient':ingList[i].id}, {$set : {'ingredientsUsed.$.totalCost' : ing.spendingInfo.avgPrice * (rep.ingredientsUsed[j].totalUnitsConsumed/ing.nativeInfo.numNativeUnitsPerPackage)}})
                    }
                }
            }
        }
        console.log(ProductionReport.find().fetch())
    }
});