import { Mongo } from 'meteor/mongo';
import ProductionReport from './ProductionReport.js';
import  Formulas  from '../Formulas/formulas.js';
import { Intermediates } from '../Intermediates/intermediates'
import '../ProfitabilityReport/ProfReportApi.js'

if (Meteor.isClient) {
    Meteor.subscribe('prodReport')
}

Meteor.methods({
    'production.log': function(formulaId, qty) {
        if (ProductionReport.find({ formula : formulaId }).fetch().length === 0) {      
            var item1 = Formulas.find({ _id : formulaId}).fetch()[0]
            var item2 = Intermediates.find({_id: formulaId}).fetch()[0]
            let formula = item1 != undefined ? item1 : item2

            ingList = []
            costArr = []


            for (var i = 0; i < formula.ingredientsList.length; i++) {
                var ing = IngredientsList.find({ _id : formula.ingredientsList[i].id}).fetch()[0]
                let int = Intermediates.findOne({_id: formula.ingredientsList[i].id})

                if (ing != undefined) {
                    ingList.push({
                        ingredient: formula.ingredientsList[i].id,
                        totalCost: Number(ing.spendingInfo.totalProdSpending).toFixed(2),
                        totalUnitsConsumed: Number(formula.ingredientsList[i].amount * (qty/formula.productUnits)).toFixed(2)
                    })
                    costArr.push(((formula.ingredientsList[i].amount * (qty/formula.productUnits))/ing.nativeInfo.numNativeUnitsPerPackage) * ing.spendingInfo.avgPrice)
                }
            }

            ProductionReport.insert({
              formula: formulaId,
              totalProduced: qty,
              ingredientsUsed: ingList,
              totalSpent: Number(costArr.reduce(function(a,b,) {return a + b;},0)).toFixed(2)
            }); 

            // if (item1 != undefined) {
            //     Meteor.call('profreport.updateTotalCost',formulaId)
            // }
        }
        else {
            console.log('second if')
            ProductionReport.update( {formula : formulaId}, {$inc : { totalProduced : qty}})
            var item1 = Formulas.find({ _id : formulaId}).fetch()[0]
            var item2 = Intermediates.find({_id: formulaId}).fetch()[0]
            let formula = item1 != undefined ? item1 : item2

            let ingList = formula.ingredientsList
            ProductionReport.update({formula:formulaId},{$set : {totalSpent : 0}})
            
            for (var i = 0; i < ingList.length; i++) {
                
                var ing = IngredientsList.find({ _id : ingList[i].id}).fetch()[0]
                var rep = ProductionReport.find({formula:formulaId}).fetch()[0]
                
                for (var j = 0; j < rep.ingredientsUsed.length; j++) {
                    if (rep.ingredientsUsed[j].ingredient == ingList[i].id) {
                        ProductionReport.update({formula:formulaId, 'ingredientsUsed.ingredient':ingList[i].id}, {$inc : {'ingredientsUsed.$.totalUnitsConsumed' : Number(ingList[i].amount * (qty/formula.productUnits)).toFixed(2)}})
                        var consumedTotal = ProductionReport.find({formula:formulaId}).fetch()[0].ingredientsUsed[j].totalUnitsConsumed 
                        ProductionReport.update({formula:formulaId, 'ingredientsUsed.ingredient':ingList[i].id}, {$set : {'ingredientsUsed.$.totalCost' : Number(ing.spendingInfo.totalProdSpending).toFixed(2)}})
                        var costTotal = ProductionReport.find({formula:formulaId}).fetch()[0].ingredientsUsed[j].totalCost
                        ProductionReport.update({formula:formulaId},{$inc : {totalSpent : Number(costTotal).toFixed(2)}})
                    }
                }
            }
            // if (item1 != undefined) {
            //     Meteor.call('profreport.updateTotalCost',formulaId)
            // }
                 
        }
        console.log(ProductionReport.find().fetch())
    },
    'production.remove': function(formulaId) {

        ProductionReport.remove({formula: formulaId})

       
    }
});