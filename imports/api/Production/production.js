import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import IngredientsList from '../Ingredients/IngredientList.js'
import { Formulas } from '../Formulas/formulas.js'

Meteor.methods({
    'production.produce'(formulaID, numUnitsProduce, ingList) {
        
        if (! this.userId || !Roles.userIsInRole(this.userId, ['admin', 'manager'])) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        let formula = Formulas.findOne({_id: formulaID})
        
        //check to see we hit min num units to produce
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
            let ingredient = IngredientsList.findOne({_id: ingList[i].ingredient})

            Meteor.call('editTotalNumNativeUnits', ingList[i].ingredient, ingList[i].newStock)
        }

    },

})