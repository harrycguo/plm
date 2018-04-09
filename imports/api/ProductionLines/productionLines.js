import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import IngredientsList from '../Ingredients/IngredientList.js';
import { IngredientFormulaSchema, FormulaSchema } from '../Ingredients/Schemas.js';
import ProductionReport from '../ProductionReport/ProductionReport.js';
import { Intermediates } from '../Intermediates/intermediates'

export const ProductionLines = new Mongo.Collection('productionLines');

Meteor.methods({
  'productionLines.insert'(name, description, formulasList) {

    // Make sure the user is logged in before inserting a task
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    //pl name must be unique
    if (ProductionLines.find({ name: name.trim() }).count() > 0) {
      throw new Meteor.Error('production line already in system', 'Production Line Name Must Be Unique');
    }

    //any null entries
    for (let i = 0; i < formulasList.length; i++) {
      if (formulasList[i].id == null) {
        throw new Meteor.Error('Null Entries', 'Null Entries in Formula Selection');
      }
    }

    //Check to see that ingredients aren't showing up twice when passed in
    let set = new Set()

    for (let i = 0; i < formulasList.length; i++) {
      if (!set.has(formulasList[i].id)) {
        set.add(formulasList[i].id)
      } else {
        throw new Meteor.Error('multiple same ingredients added', 'Formulas(s) shows up twice for this Production Line');
      }
    }

    ProductionLines.insert({
      name: name,
      description: description,
      formulasList: formulasList,
      currentFormula: null,
      busy: false
    })    
  },
  'productionLines.edit'(id, name, description, formulasList){

    // Make sure the user is logged in before inserting a task
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    let existingPL = ProductionLines.findOne({ _id: id})

    if (existingPL.busy){
      throw new Meteor.Error('pl busy', 'Production Line Busy! Cannot Edit at this time. Please wait until Production is complete on this line before editing');
    }

    //Production Line name must be unique
    if ( ProductionLines.find({ name: name.trim() }).count() > 0 && !(existingPL.name == name)) {
      throw new Meteor.Error('pl already in system', 'Production Line Name Must Be Unique');
    }

    //any null entries
    for (let i = 0; i < formulasList.length; i++) {
      if (formulasList[i].id == null) {
        throw new Meteor.Error('Null Entries', 'Null Entries in Formula Selection');
      }
    }

    //Check to see that ingredients aren't showing up twice when passed in
    let set = new Set()

    for (let i = 0; i < formulasList.length; i++) {
      if (!set.has(formulasList[i].id)) {
        set.add(formulasList[i].id)
      } else {
        throw new Meteor.Error('multiple same ingredients added', 'Formulas(s) shows up twice for this Production Line');
      }
    }

    ProductionLines.update({ _id: id }, {
      $set: {
        name: name,
        description: description,
        formulasList: formulasList
      }
    })

  },
  'productionLines.delete'(plID) {

    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    let line = ProductionLines.findOne({ _id: plID })
    if (line.busy){
      throw new Meteor.Error('line currently in use', 'Line Currently in Use, cannot delete')
    }

    ProductionLines.remove(plID)
    
  },


})

if (Meteor.isServer) {
  Meteor.publish('productionLines', function () {
    return ProductionLines.find();
  });
}



