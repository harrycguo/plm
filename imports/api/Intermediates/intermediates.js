import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Bert } from 'meteor/themeteorchef:bert';
import { StorageCapacities } from '../StorageCapacities/storageCapacities.js';
import { Formulas } from '../Formulas/formulas.js'
import IngredientsList from '../Ingredients/IngredientList.js';

export const Intermediates = new Mongo.Collection('intermediates');

if (Meteor.isClient) {
  Meteor.subscribe('storageCapacities');
}

Meteor.methods({
  'intermediates.insert'(name, description, productUnits, ingredientsList, temperatureState, ingPackage, numPackages, ingStorage, totalNumNativeUnits, nativeUnit, numNativeUnitsPerPackage) {
    console.log("inseringeinf intermedd")

    // Make sure the user is logged in before inserting a task
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    //Formula name must be unique
    if (Intermediates.find({ name: name.trim() }).count() > 0) {
      throw new Meteor.Error('formula already in system', 'Formula Name Must Be Unique');
    }

    //product Units must be positive
    if (productUnits <= 0) {
      throw new Meteor.Error('Product Units must be greater than 0', 'Product Units must be greater than 0')
    }

    //product Units must be positive
    if (numNativeUnitsPerPackage <= 0) {
      throw new Meteor.Error('Product Units must be greater than 0', 'Number of Native Units per package must be greater than 0')
    }

    //no ingredients check
    if (ingredientsList.length == 0) {
      throw new Meteor.Error('No ingredients', 'No Ingredients in Formula');
    }

    //any null entries
    for (let i = 0; i < ingredientsList.length; i++) {
      console.log(ingredientsList[i])
      if (ingredientsList[i].id == null) {
        throw new Meteor.Error('Null Entries', 'Null Entries in Ingredient Selection');
      }
      if (ingredientsList[i].amount <= 0) {
        throw new Meteor.Error('Zero', 'Ingredient Quantity entered must be greater than 0');
      }
    }

    //Check to see that ingredients aren't showing up twice when passed in
    let set = new Set()

    for (let i = 0; i < ingredientsList.length; i++) {
      if (!set.has(ingredientsList[i].id)) {
        set.add(ingredientsList[i].id)
      } else {
        throw new Meteor.Error('multiple same ingredients added', 'Ingredient(s) shows up twice on Add Ingredients portion');
      }
    }

    //Check to see if capacity won't be exceeded
    if (!(ingPackage.toLowerCase() == 'truckload' || ingPackage.toLowerCase() == 'railcar')) {
      let container = StorageCapacities.findOne({ type: temperatureState });
      let newUsed = Number(container.used) + Number(ingStorage)
      Meteor.call('sc.editUsed', container._id, Number(newUsed));
    }

    let packageInfoArr = {
      packageType: ingPackage.toLowerCase(),
      numPackages: Number(numPackages),
    }

    let nativeInfoArr = {
      totalQuantity: Number(totalNumNativeUnits),
      nativeUnit: nativeUnit,
      numNativeUnitsPerPackage: Number(numNativeUnitsPerPackage),
    }

    Intermediates.insert({
      name: name,
      description: description,
      productUnits: Number(productUnits),
      ingredientsList: ingredientsList,
      temperatureState: temperatureState.toLowerCase(),
      packageInfo: packageInfoArr,
      storage: Number(ingStorage),
      nativeInfo: nativeInfoArr,
      formulaInfo: []
    })

  },




})

if (Meteor.isServer) {
  Meteor.publish('intermediates', function () {
    return Intermediates.find();
  })
}