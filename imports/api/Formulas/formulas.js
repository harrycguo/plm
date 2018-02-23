import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
 
export const Formulas = new Mongo.Collection('formulas');

Meteor.methods({
    'formulas.insert'(name, description, productUnits, ingredientsList) {
    
      // Make sure the user is logged in before inserting a task
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized', 'not-authorized');
      }

      //Formula name must be unique
      if (Formulas.find({name: name.trim()}).count() > 0){
        throw new Meteor.Error('formula already in system', 'Formula Name Must Be Unique');
      }

      //no ingredients check
      if (ingredientsList.length == 0) {
        throw new Meteor.Error('No ingredients', 'No Ingredients in Formula');
      }

      //any null entries
      for (let i = 0; i < ingredientsList.length; i++){
        if (ingredientsList[i].id == null) {
          throw new Meteor.Error('Null Entries', 'Null Entries in Ingredient Selection');
        }
        if (ingredientsList[i].amount <= 0) {
          throw new Meteor.Error('Zero', 'Ingredient Quantity entered must be greater than 0');
        }
      }

      //Check to see that ingredients aren't showing up twice when passed in
      let set = new Set()

      for (let i = 0; i < ingredientsList.length; i++){
        if (!set.has(ingredientsList[i].id)){
            set.add(ingredientsList[i].id)
        } else {
            throw new Meteor.Error('multiple same ingredients added', 'Ingredient(s) shows up twice on Add Ingredients portion');
        }
      }

      Formulas.insert({
        name: name,
        description: description,
        productUnits: Number(productUnits),
        ingredientsList: ingredientsList
      });
    },

    'formulas.remove'(formulaID) {
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized', 'not-authorized');
      }
      Formulas.remove(formulaID);
    },

    'formulas.edit'(id, name, description, productUnits, ingredientsList) {
    
      // Make sure the user is logged in before inserting a task
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized', 'not-authorized');
      }

      let existingFormula = Formulas.findOne({_id: id})
      //console.log(existingFormula)

      //Formula name must be unique
      if (Formulas.find({name: name.trim()}).count() > 0 && !(existingFormula.name == name)){
        throw new Meteor.Error('formula already in system', 'Formula Name Must Be Unique');
      }

      //no ingredients check
      if (ingredientsList.length == 0) {
        throw new Meteor.Error('No ingredients', 'No Ingredients in Formula');
      }

      //any null entries
      for (let i = 0; i < ingredientsList.length; i++){
        if (ingredientsList[i].id == null) {
          throw new Meteor.Error('Null Entries', 'Null Entries in Ingredient Selection');
        }
        if (ingredientsList[i].amount <= 0) {
          throw new Meteor.Error('Zero', 'Ingredient Quantity entered must be greater than 0');
        }
      }

      //Check to see that ingredients aren't showing up twice when passed in
      let set = new Set()

      for (let i = 0; i < ingredientsList.length; i++){
        if (!set.has(ingredientsList[i].id)){
            set.add(ingredientsList[i].id)
        } else {
            throw new Meteor.Error('multiple same ingredients added', 'Ingredient(s) shows up twice on Add Ingredients portion');
        }
      }

      Formulas.update({_id: id}, { $set: {
        name: name,
        description: description,
        productUnits: Number(productUnits),
        ingredientsList: ingredientsList
      }});

    },

  });

if (Meteor.isServer) {
  Meteor.publish('formulas', function() {
    return Formulas.find();
  });
}


