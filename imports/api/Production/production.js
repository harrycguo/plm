import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import IngredientsList from '../Ingredients/IngredientList.js'
import  Formulas  from '../Formulas/formulas.js'
import { Intermediates } from '../Intermediates/intermediates.js'
import { ProductionLines } from '../ProductionLines/productionLines.js'
import '../ProductionReport/ProductionReportApi.js';
import ProductionReport from '../ProductionReport/ProductionReport.js'
import { LotNumberSystem } from '../../api/Lots/LotNumberSystem'
import Lots from '../../api/Lots/Lots.js'

export const ProductionHistory = new Mongo.Collection('productionHistory');

Meteor.methods({
    'production.initialize'(formulaID, numUnitsProduce, ingList, productionLineID){
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
                throw new Meteor.Error('Not Enough Stock', 'Not Enough Stock. Please Add Missing Ingredients to Cart and Checkout and / or Produce Intermediates');
            }
        }

        //check to see production Line
        if (productionLineID == 'none'){
            throw new Meteor.Error('No Production Line Selected', 'No Production Line Selected');
        }

        //Consume!!!
        let lotsData = []

        for (let i = 0; i < ingList.length; i++) {
            let ing = IngredientsList.findOne({_id: ingList[i].ingredient})
            let int = Intermediates.findOne({_id: ingList[i].ingredient})
            
            if (ing != undefined){
                Meteor.call('editTotalNumNativeUnits', ingList[i].ingredient, ingList[i].newStock)
            } else {
                Meteor.call('intermediates.editTotalNumNativeUnits', ingList[i].ingredient, ingList[i].newStock)
            }

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
            
            if (ing != undefined) { Meteor.call('ingredients.updateTotalProdSpending', ingList[i].ingredient, totalIngProdAmt) }
            
            //set the lot numbers
            let lots = []
            let ingLot = Lots.findOne({inventoryID: ingList[i].ingredient})
            let q = ingLot.queue
            let k = 0

            while (totalIngProdAmt > 0){
                lots.push({
                    lotNumber: q[k].lot,
                    time: q[k].time
                })
                let quantityInLot = q[k].qty
                if (quantityInLot - totalIngProdAmt < 0){
                    totalIngProdAmt -= quantityInLot
                    k++
                } else {
                    break
                }
            }

            lotsData.push({
                ingredient: ingList[i].ingredient,
                lots: lots
            })

            Meteor.call('lots.removeQty', ingList[i].ingredient, totalIngProdAmt)
        }
        
        
        Meteor.call('productionLines.startProduction', productionLineID, formulaID, numUnitsProduce, lotsData)

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

                Meteor.call('addIngredientToCart',
                        ingredient,
                        packagesNeeded,
                        null)

            }
        }
    },

})

if (Meteor.isServer) {
    Meteor.publish('productionHistory', function () {
      return ProductionHistory.find();
    });
  }