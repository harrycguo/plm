import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import IngredientsList from '../Ingredients/IngredientList.js';
import { IngredientFormulaSchema, FormulaSchema } from '../Ingredients/Schemas.js';
import ProductionReport from '../ProductionReport/ProductionReport.js';
import { Intermediates } from '../Intermediates/intermediates'
import '../ProfitabilityReport/ProfReportApi.js'
import '../FreshReport/FreshReportApi.js'

Formulas = new Mongo.Collection('formulas');
// Formulas.attachSchema(FormulaSchema)

Meteor.methods({
  'formulas.insert'(name, description, productUnits, ingredientsList) {

    // Make sure the user is logged in before inserting a task
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    //Formula name must be unique
    if (Formulas.find({ name: name.trim() }).count() > 0 || Intermediates.find({ name: name.trim() }).count() > 0) {
      throw new Meteor.Error('formula already in system', 'Formula Name Must Be Unique');
    }

    //no ingredients check
    if (ingredientsList.length == 0) {
      throw new Meteor.Error('No ingredients', 'No Ingredients in Formula');
    }

    //product Units must be positive
    if (productUnits <= 0){
      throw new Meteor.Error('Product Units must be greater than 0', 'Product Units must be greater than 0')
    }

    //any null entries
    for (let i = 0; i < ingredientsList.length; i++) {
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

    var x = Formulas.insert({
      name: name,
      description: description,
      productUnits: Number(productUnits),
      ingredientsList: ingredientsList,
      quantity: 0
    },
      function (error, result) {
        //attach formulaID
        for (let ingID of set) {
          let ing = IngredientsList.findOne({ _id: ingID })
          let int = Intermediates.findOne({_id: ingID})
          
          if (ing != undefined){
  
            let newFormulaInfo = ing.formulaInfo.concat(result)

            IngredientsList.update({ _id: ingID }, {
              $set: {
                formulaInfo: newFormulaInfo
              }
            })
          } else {
            let newFormulaInfo = int.formulaInfo.concat(result)

            Intermediates.update({ _id: ingID }, {
              $set: {
                formulaInfo: newFormulaInfo
              }
            })
          }          
        }
      })

      let formula = Formulas.find({name : name}).fetch()[0]

      Meteor.call('systemlog.insert', "Formula", name, x, "Added", "")
    
  },

  'formulas.remove'(formulaID) {
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    //detach id from ingredient
    let existingFormula = Formulas.findOne({ _id: formulaID})
    let ingList = existingFormula.ingredientsList

    for (let i = 0; i < ingList.length; i++){
      let ing = IngredientsList.findOne({ _id: ingList[i].id })
      let int = Intermediates.findOne({_id: ingList[i].id })

      if (ing != undefined){
        let formulaInfo = ing.formulaInfo
    
        let index = formulaInfo.indexOf(formulaID)
        formulaInfo.splice(index, 1);
  
        IngredientsList.update({ _id: ingList[i].id }, {
          $set: {
            formulaInfo: formulaInfo
          }
        })
      } else {
        let formulaInfo = int.formulaInfo
    
        let index = formulaInfo.indexOf(formulaID)
        formulaInfo.splice(index, 1);

        Intermediates.update({ _id: ingList[i].id }, {
          $set: {
            formulaInfo: formulaInfo
          }
        })
      }

      
    }
    Meteor.call('systemlog.insert', "Formula", existingFormula.name, formulaID, "Removed", "")
    Meteor.call('production.remove',formulaID)
    Meteor.call('productionLines.removeFormula', formulaID)
    Formulas.remove(formulaID);

    

  },

  'formulas.edit'(id, name, description, productUnits, ingredientsList) {

    // Make sure the user is logged in before inserting a task
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    let existingFormula = Formulas.findOne({ _id: id }) != undefined ? Formulas.findOne({ _id: id }) : Intermediates.findOne({ _id: id })

    //Formula name must be unique
    if ( (Formulas.find({ name: name.trim() }).count() > 0 || Intermediates.find({ name: name.trim() }).count() > 0) && !(existingFormula.name == name)) {
      throw new Meteor.Error('formula already in system', 'Formula Name Must Be Unique');
    }

    //product Units must be positive
    if (productUnits <= 0){
      throw new Meteor.Error('Product Units must be greater than 0', 'Product Units must be greater than 0')
    }

    //no ingredients check
    if (ingredientsList.length == 0) {
      throw new Meteor.Error('No ingredients', 'No Ingredients in Formula');
    }

    //any null entries
    for (let i = 0; i < ingredientsList.length; i++) {
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

    //attach id to ingredient
    for (let ingID of set) {
      let ing = IngredientsList.findOne({ _id: ingID })
      let int = Intermediates.findOne({_id: ingID})

      if (ing != undefined){
        let formulaInfo = ing.formulaInfo

        if (!formulaInfo.includes(id)){
          formulaInfo = formulaInfo.concat(id)
          IngredientsList.update({ _id: ingID }, {
            $set: {
              formulaInfo: formulaInfo
            }
          })
        }  
      } else {
        let formulaInfo = int.formulaInfo

        if (!formulaInfo.includes(id)){
          formulaInfo = formulaInfo.concat(id)
          Intermediates.update({ _id: ingID }, {
            $set: {
              formulaInfo: formulaInfo
            }
          })
        }  
      }
    }



    var oldFormula = Formulas.findOne({_id: id})
    Meteor.call('systemlog.insert', "Formula", oldFormula.name, id, "Modified - Name", name)
    Meteor.call('systemlog.insert', "Formula", name, id, "Modified - Description", description)
    Meteor.call('systemlog.insert', "Formula", name, id, "Modified - Units", productUnits)

    Formulas.update({ _id: id }, {
      $set: {
        name: name,
        description: description,
        productUnits: Number(productUnits),
        ingredientsList: ingredientsList
      }
    });

  },

});

export default Formulas;

if (Meteor.isServer) {
  Meteor.publish('formulas', function () {
    return Formulas.find();
  });
}



