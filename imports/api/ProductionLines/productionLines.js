import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import IngredientsList from '../Ingredients/IngredientList.js';
import { IngredientFormulaSchema, FormulaSchema } from '../Ingredients/Schemas.js';
import ProductionReport from '../ProductionReport/ProductionReport.js';
import { Intermediates } from '../Intermediates/intermediates'
import  Formulas  from '../Formulas/formulas.js'
import '../ProductionReport/ProductionReportApi.js';
import { LotNumberSystem } from '../../api/Lots/LotNumberSystem'
import Lots from '../../api/Lots/Lots.js'
import { ProductionHistory } from '../Production/production.js'
import '../FreshReport/FreshReportApi.js'
import '../ProfitabilityReport/ProfReportApi.js'

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
    Meteor.call('systemlog.insert',"Production Line", "Added", null, "Event", "");
    ProductionLines.insert({
      name: name,
      description: description,
      formulasList: formulasList,
      busy: false,
      currentFormula: null,
      quantity: 0,
      lotsData: null,
    })    
  },
  'productionLines.edit'(id, name, description, formulasList){

    // Make sure the user is logged in before inserting a task
    if (!this.userId || !Roles.userIsInRole(this.userId, ['admin', 'manager'])) {
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
  'productionLines.startProduction'(plID, formulaID, quantity, lotsData){

    if (! this.userId || !Roles.userIsInRole(this.userId, ['admin', 'manager'])) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    let line = ProductionLines.findOne({ _id: plID })

      ProductionLines.update({ _id: plID }, {
        $set: {
          busy: true,
          currentFormula: formulaID,
          quantity: quantity,
          lotsData: lotsData,
        }
      })
  },
  'productionLines.endProduction'(plArray){

    if (! this.userId || !Roles.userIsInRole(this.userId, ['admin', 'manager'])) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    resArray = []

    for (let i = 0; i < plArray.length; i++){
      if (plArray[i].status == 'complete') {

        let line = ProductionLines.findOne({ _id: plArray[i].line })
        let formulaID = line.currentFormula
        let numUnitsProduce = line.quantity
        let lotsData = line.lotsData

        let formula = Formulas.findOne({_id: formulaID})
        let intermediate = Intermediates.findOne({_id: formulaID})

        let item = formula != undefined ? formula : intermediate

        if (intermediate != undefined){
          let newTotal = numUnitsProduce + intermediate.nativeInfo.totalQuantity
          Meteor.call('intermediates.editTotalNumNativeUnits', formulaID, newTotal)
        } else {
          Formulas.update({_id: formulaID}, {$inc: { quantity: numUnitsProduce}})
        }

        let lotNumber = LotNumberSystem.findOne({name: 'system'})
        resArray.push({
          name: item.name,
          lotNumber: lotNumber.lotNumber
        })

        ProductionHistory.insert({
            name: item.name,
            lotNumber: lotNumber.lotNumber,
            unitsProduced: numUnitsProduce,
            time: new Date(),
            lotsData: lotsData
        })

        Meteor.call('systemlog.insert',"Production", "Produced", null, "Event", "");
        Meteor.call('production.log',formulaID,numUnitsProduce)
        Meteor.call('lots.addFormula', item._id, numUnitsProduce, lotNumber.lotNumber, new Date())

        ProductionLines.update({ _id: plArray[i].line  }, {
          $set: {
            busy: false,
            currentFormula: null,
            quantity: 0,
            lotsData: null,
          }
        })
      }
    }

    return resArray
  },
  'productionLines.removeFormula'(formulaID){
    ProductionLines.update({}, { $pull : { formulasList : { id : formulaID }}}, { multi: true})
  }

})

if (Meteor.isServer) {
  Meteor.publish('productionLines', function () {
    return ProductionLines.find();
  });
}



