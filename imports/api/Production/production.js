import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import IngredientsList from '../Ingredients/IngredientList.js'
import { Formulas } from '../Formulas/formulas.js'
import { Intermediates } from '../Intermediates/intermediates.js'
import '../ProductionReport/ProductionReportApi.js';
import ProductionReport from '../ProductionReport/ProductionReport.js'

Meteor.methods({
    'production.produce'(formulaID, numUnitsProduce, ingList) {
        
        if (! this.userId || !Roles.userIsInRole(this.userId, ['admin', 'manager'])) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        let formula = Formulas.findOne({_id: formulaID})
        let intermediate = Intermediates.findOne({_id: formulaID})

        let item = formula != undefined ? formula : intermediate
        
        //check to see we hit min num units to produce
        if (numUnitsProduce < item.productUnits){
            throw new Meteor.Error('Must Produce At Least Minimum Product Units', 'Must Produce At Least Minimum Product Units');
        }

        //check to see if we have enough
        for (let i = 0; i < ingList.length; i++) {
            if (ingList[i].notEnough == true) {
                throw new Meteor.Error('Not Enough Stock', 'Not Enough Stock. Please Add Missing Ingredients to Cart and Checkout and / or Produce Intermediates ');
            }
        }

        console.log(ingList)

        if (intermediate != undefined){
            let newTotal = numUnitsProduce + intermediate.nativeInfo.totalQuantity
            Meteor.call('intermediates.editTotalNumNativeUnits', formulaID, newTotal)
        }
        
        //Consume!!!
        for (let i = 0; i < ingList.length; i++) {
            let ing = IngredientsList.findOne({_id: ingList[i].ingredient})
            let int = Intermediates.findOne({_id: ingList[i].ingredient})
            
            if (ing != undefined){
                Meteor.call('editTotalNumNativeUnits', ingList[i].ingredient, ingList[i].newStock)

                var numNativeUnitsPerProductUnit = 0
                var formulaProductUnits = 0
                for (var j = 0; j < item.ingredientsList.length; j++) {
                    if (item.ingredientsList[i].id == ingList[i].ingredient) {
                        numNativeUnitsPerProductUnit = item.ingredientsList[i].amount
                        formulaProductUnits = item.productUnits
                        break
                    }
                }
                var totalIngProdAmt = (numUnitsProduce * numNativeUnitsPerProductUnit)/formulaProductUnits
                Meteor.call('ingredients.updateTotalProdSpending', ingList[i].ingredient, totalIngProdAmt)
                Meteor.call('lots.remove', ingList[i].ingredient, totalIngProdAmt)

            } else {
                Meteor.call('intermediates.editTotalNumNativeUnits', ingList[i].ingredient, ingList[i].newStock)
            }
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

        //if not enough first check: make sure we have intermediates
        let notEnoughInter = ''
        for (let i = 0; i < ingList.length; i++) {
            if (ingList[i].notEnough == true) {
                let intermediate = Intermediates.findOne({_id: ingList[i].ingredient})
                
                if (intermediate != undefined){
                    notEnoughInter += intermediate.name + ', '
                }
            }
        }

        if (notEnoughInter.length > 0){
            notEnoughInter = notEnoughInter.substring(0, notEnoughInter.length - 2)
            throw new Meteor.Error('Not Enough of Intermediate', 'Please produce more of Intermediate(s) first: ' + notEnoughInter)
        }

        //now add to cart
        for (let i = 0; i < ingList.length; i++) {
            if (ingList[i].notEnough == true) {
                
                let ingredient = IngredientsList.findOne({_id: ingList[i].ingredient})

                if (ingredient.vendorInfo.length <= 0){
                    throw new Meteor.Error('Ingredient Has No Vendor', 'Ingredient: ' + ingredient.name + " has no Vendor. Please add a Vendor.");
                }

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