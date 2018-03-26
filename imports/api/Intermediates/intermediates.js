import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Bert } from 'meteor/themeteorchef:bert';
import { StorageCapacities } from '../StorageCapacities/storageCapacities.js';
import { Formulas } from '../Formulas/formulas.js'
import IngredientsList from '../Ingredients/IngredientList.js';
import { IngredientFormulaSchema, PackageInfoSchema, NativeInfoSchema, VendorInfoSchema, FormulaInfoSchema, SpendingInfoSchema, IntermediateSchema } from '../Ingredients/Schemas.js';

export const Intermediates = new Mongo.Collection('intermediates');

if (Meteor.isClient) {
  Meteor.subscribe('storageCapacities');
}

Meteor.methods({
  'intermediates.insert'(name, description, productUnits, ingredientsList, temperatureState, ingPackage, numPackages, ingStorage, totalNumNativeUnits, nativeUnit, numNativeUnitsPerPackage) {

    // Make sure the user is logged in before inserting a task
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    //Formula name must be unique
    if (Formulas.find({ name: name.trim() }).count() > 0 || Intermediates.find({ name: name.trim() }).count() > 0) {
      throw new Meteor.Error('formula already in system', 'Formula Name Must Be Unique');
    }

    //product Units must be positive
    if (productUnits <= 0) {
      throw new Meteor.Error('Product Units must be greater than 0', 'Product Units must be greater than 0')
    }

    //num native units per package must be positive
    if (numNativeUnitsPerPackage <= 0) {
      throw new Meteor.Error('Product Units must be greater than 0', 'Number of Native Units per package must be greater than 0')
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
    },
    function (error, result) {
      //attach formulaID
      for (let ingID of set) {
        let ing = IngredientsList.findOne({ _id: ingID })
        let int = Intermediates.findOne({_id: ingID})
        
        if (ing != undefined){
          console.log('attaching ID to ing')
          let newFormulaInfo = ing.formulaInfo.concat(result)

          IngredientsList.update({ _id: ingID }, {
            $set: {
              formulaInfo: newFormulaInfo
            }
          })
        } else {
          console.log('attaching ID to formula')
          let newFormulaInfo = int.formulaInfo.concat(result)

          Intermediates.update({ _id: ingID }, {
            $set: {
              formulaInfo: newFormulaInfo
            }
          })
        }          
      }
    })

  },
  'intermediates.edit'(id, name, description, productUnits, ingredientsList, temperatureState, packageType, numPackages, ingStorage, totalNumNativeUnits, nativeUnit, numNativeUnitsPerPackage) {

    // Make sure the user is logged in before inserting a task
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    Meteor.call('intermediates.editName', id, name)
    Meteor.call('intermediates.editDescription', id, description)
    Meteor.call('intermediates.editProductUnits', id, productUnits)
    Meteor.call('intermediates.editTemperatureState', id, temperatureState)
    Meteor.call('intermediates.editPackageType', id, packageType.toLowerCase())
    Meteor.call('intermediates.editNumNativeUnitsPerPackage', id, numNativeUnitsPerPackage)
    Meteor.call('intermediates.editNativeUnit', id, nativeUnit)
    Meteor.call('intermediates.editIngredientsList', id, ingredientsList)

  },
  'intermediates.editName'(id, name) {
    // Make sure the user is logged in before inserting a task
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    let existingFormula = Formulas.findOne({ _id: id }) != undefined ? Formulas.findOne({ _id: id }) : Intermediates.findOne({ _id: id })

    //Formula name must be unique
    if ((Formulas.find({ name: name.trim() }).count() > 0 || Intermediates.find({ name: name.trim() }).count() > 0) && !(existingFormula.name == name)) {
      throw new Meteor.Error('formula already in system', 'Formula Name Must Be Unique');
    }

    Intermediates.update({ _id: id }, {
      $set: {
        name: name,
      }
    });
  },
  'intermediates.editDescription'(id, description) {
    Intermediates.update({ _id: id }, {
      $set: {
        description: description,
      }
    });
  },
  'intermediates.editProductUnits'(id, productUnits) {
    //product Units must be positive
    if (productUnits <= 0) {
      throw new Meteor.Error('Product Units must be greater than 0', 'Product Units must be greater than 0')
    }

    Intermediates.update({ _id: id }, {
      $set: {
        productUnits: productUnits,
      }
    });
  },
  'intermediates.editTemperatureState'(id, temperatureState) {

    //moving temperature states would change quantities

    check(temperatureState, String);

    Intermediates.update({ _id: id }, {
      $set: {
        temperatureState: temperatureState,
      }
    });
  },
  'intermediates.editPackageType'(id, packageType) {

    check(packageType, String);

    Intermediates.update({ _id: id }, {
      $set: {
        'packageInfo.packageType': packageType,
      }
    });

  },
  'intermediates.editNumNativeUnitsPerPackage'(id, numNativeUnitsPerPackage) {

    //num native units per package must be positive
    if (numNativeUnitsPerPackage <= 0) {
      throw new Meteor.Error('Product Units must be greater than 0', 'Number of Native Units per package must be greater than 0')
    }

    Intermediates.update({ _id: id }, {
      $set: {
        'nativeInfo.numNativeUnitsPerPackage': numNativeUnitsPerPackage,
      }
    });

  },
  'intermediates.editNativeUnit'(id, nativeUnit) {
    Intermediates.update({ _id: id }, {
      $set: {
        'nativeInfo.nativeUnit': nativeUnit,
      }
    })
  },
  'intermediates.remove'(id) {
    // Make sure the user is logged in before inserting a task
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    let existingIntermediate = Intermediates.findOne({ _id: id });
    let formulasError = ""
    let removeArr = []
    let formulaInfo = existingIntermediate.formulaInfo

    if (formulaInfo.length > 0) {
      for (let i = 0; i < formulaInfo.length; i++) {
        let existingFP = Formulas.findOne({ _id: formulaInfo[i] })
        let existingInt = Intermediates.findOne({ _id: formulaInfo[i] })

        if (existingFP == undefined && existingInt == undefined) {
          removeArr.push(i)
        } else {
          let item = existingFP != undefined ? existingFP : existingInt
          let ingList = item.ingredientsList
          let ingListSet = new Set()
          for (let k = 0; k < ingList.length; k++) {
            ingListSet.add(ingList[k].id)
          }
          if (!ingListSet.has(id)) {
            removeArr.push(i)
          }
          else {
            formulasError += item.name + ", "
          }
        }
      }

      if (removeArr.length > 0) {
        for (let j = 0; j < removeArr.length; j++) {
          let index = removeArr[j] - j
          formulaInfo.splice(index, 1);
        }
      }

      Intermediates.update({ _id: id }, {
        $set: {
          formulaInfo: formulaInfo
        }
      })
    }

    if (formulasError.length > 0) {
      formulasError = formulasError.substring(0, formulasError.length - 2)
      throw new Meteor.Error('Intermediate used in a formulas', 'Cannot delete, Intermediate used in Formula(s): ' + formulasError);
    }
    Meteor.call('production.remove', id)
    Intermediates.remove({ _id: id });
  },
  'intermediates.editIngredientsList'(id, ingredientsList){
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

    Intermediates.update({ _id: id }, {
      $set: {
        ingredientsList: ingredientsList
      }
    })

  }

})

if (Meteor.isServer) {
  Meteor.publish('intermediates', function () {
    return Intermediates.find();
  })
}