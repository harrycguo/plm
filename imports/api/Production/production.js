import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import IngredientsList from '../Ingredients/IngredientList.js'
import { Formulas } from '../Formulas/formulas.js'
import '../ProductionReport/ProductionReportApi.js';
import ProductionReport from '../ProductionReport/ProductionReport.js'

Meteor.methods({
    'production.produce'(formulaID, numUnitsProduce, ingList) {
        
        if (! this.userId || !Roles.userIsInRole(this.userId, ['admin', 'manager'])) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        let formula = Formulas.findOne({_id: formulaID})
        
        //check to see we hit min num units to producejnm,mnn
        if (numUnitsProduce < formula.productUnits){
            throw new Meteor.Error('Must Produce At Least Minimum Product Units', 'Must Produce At Least Minimum Product Units');
        }

        //check to see if we have enough
        for (let i = 0; i < ingList.length; i++) {
            if (ingList[i].notEnough == true) {
                throw new Meteor.Error('Not Enough Stock', 'Not Enough Stock. Please Add Missing Ingredients to Cart and Checkout');
            }
        }

        //Consume!!!
        for (let i = 0; i < ingList.length; i++) {
            Meteor.call('editTotalNumNativeUnits', ingList[i].ingredient, ingList[i].newStock)
            var numNativeUnitsPerProductUnit = 0
            for (var j = 0; j < formula.ingredientsList.length; j++) {
                if (formula.ingredientsList[i].id == ingList[i].ingredient) {
                    numNativeUnitsPerProductUnit = formula.ingredientsList[i].amount
                }
            }
            Meteor.call('ingredients.updateTotalProdSpending', ingList[i].ingredient, numUnitsProduce * numNativeUnitsPerProductUnit)
        }
        Meteor.call('systemlog.insert',"Production", "Produced", null, "Event", "");
        Meteor.call('production.log',formulaID,numUnitsProduce)
    },
    'production.addToCart'(ingList) {
        if (! this.userId || !Roles.userIsInRole(this.userId, ['admin', 'manager'])) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        // if actually enough lol
        let enoughCount = 0
        for (let i = 0; i < ingList.length; i++) {
            if (ingList[i].notEnough == false) {
                enoughCount++
            }
        }

        if (enoughCount == ingList.length) {
            throw new Meteor.Error('Enough Stock', 'Enough Stock. Please produce Formula!');
        }

        
        //if not enough
        for (let i = 0; i < ingList.length; i++) {
            if (ingList[i].notEnough == true) {
                
                let ingredient = IngredientsList.findOne({_id: ingList[i].ingredient})

                let numPerPackage = Number(ingredient.nativeInfo.numNativeUnitsPerPackage) 

                let packagesNeeded = Math.ceil( Number(ingList[i].newStock) / Number(numPerPackage) * -1 ) 

                console.log('adding things')
                Meteor.call('addIngredientToCart',
                        ingredient,
                        packagesNeeded,
                        null)

            }
        }



    },

})