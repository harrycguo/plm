import { Mongo } from 'meteor/mongo';
import ProductionReport from './ProductionReport.js';
import { Formulas } from '../Formulas/formulas.js';

if (Meteor.isClient) {
    Meteor.subscribe('prodReport')
}

Meteor.methods({
    'production.log': function(formulaId, qty) {
        if (ProductionReport.find({ formula : formulaId }).fetch().length === 0) {
            var formula = Formulas.find({ _id : formulaId}).fetch()[0]
            ingList = []
            costArr = []
            for (var i = 0; i < formula.ingredientsList.length; i++) {
                var ing = IngredientsList.find({ _id : formula.ingredientsList[i].id}).fetch()[0]
                ingList.push({
                    ingredient: formula.ingredientsList[i].id,
                    totalCost: ing.spendingInfo.totalProdSpending,
                    totalUnitsConsumed: formula.ingredientsList[i].amount * (qty/formula.productUnits)
                })
                costArr.push(((formula.ingredientsList[i].amount * (qty/formula.productUnits))/ing.nativeInfo.numNativeUnitsPerPackage) * ing.spendingInfo.avgPrice)
            }
            ProductionReport.insert({
              formula: formulaId,
              totalProduced: qty,
              ingredientsUsed: ingList,
              totalSpent: costArr.reduce(function(a,b,) {return a + b;},0)
            });  
        }
        else {
            ProductionReport.update( {formula : formulaId}, {$inc : { totalProduced : qty}})
            var formula = Formulas.find({ _id : formulaId}).fetch()[0]
            ingList = formula.ingredientsList
            ProductionReport.update({formula:formulaId},{$set : {totalSpent : 0}})
            for (var i = 0; i < ingList.length; i++) {
                var ing = IngredientsList.find({ _id : ingList[i].id}).fetch()[0]
                var rep = ProductionReport.find({formula:formulaId}).fetch()[0]
                for (var j = 0; j < rep.ingredientsUsed.length; j++) {
                    if (rep.ingredientsUsed[j].ingredient == ingList[i].id) {
                        ProductionReport.update({formula:formulaId, 'ingredientsUsed.ingredient':ingList[i].id}, {$inc : {'ingredientsUsed.$.totalUnitsConsumed' : ingList[i].amount * (qty/formula.productUnits)}})
                        var consumedTotal = ProductionReport.find({formula:formulaId}).fetch()[0].ingredientsUsed[j].totalUnitsConsumed 
                        ProductionReport.update({formula:formulaId, 'ingredientsUsed.ingredient':ingList[i].id}, {$set : {'ingredientsUsed.$.totalCost' : ing.spendingInfo.totalProdSpending}})
                        var costTotal = ProductionReport.find({formula:formulaId}).fetch()[0].ingredientsUsed[j].totalCost
                        ProductionReport.update({formula:formulaId},{$inc : {totalSpent : costTotal}})
                    }
                }
            }
        }
        console.log(ProductionReport.find().fetch())
    },
    'production.remove': function(formulaId) {

        ProductionReport.remove({formula: formulaId})

       
    }
});