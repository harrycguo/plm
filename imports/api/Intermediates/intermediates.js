import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Bert } from 'meteor/themeteorchef:bert';
import { StorageCapacities } from '../StorageCapacities/storageCapacities.js';
import  Formulas  from '../Formulas/formulas.js'
import IngredientsList from '../Ingredients/IngredientList.js';
import Lots from '../Lots/Lots.js';
import { IngredientFormulaSchema, PackageInfoSchema, NativeInfoSchema, VendorInfoSchema, FormulaInfoSchema, SpendingInfoSchema, IntermediateSchema } from '../Ingredients/Schemas.js';
import isInt from '../../utils/checks.js';

export const Intermediates = new Mongo.Collection('intermediates');

if (Meteor.isClient) {
  Meteor.subscribe('storageCapacities');
  Meteor.subscribe('lots')
  Meteor.subscribe('lotshistory')
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

    //    'systemlog.insert'(type, name, _id, change, to)

    var x = Intermediates.insert({
      name: name,
      description: description,
      productUnits: Number(productUnits),
      ingredientsList: ingredientsList,
      temperatureState: temperatureState.toLowerCase(),
      packageInfo: packageInfoArr,
      storage: Number(ingStorage),
      nativeInfo: nativeInfoArr,
      formulaInfo: [],
      totalIngSpending: 0
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
      Meteor.call('systemlog.insert', "Intermediate", name, x, "Added", "")

  },
  'intermediates.edit'(id, name, description, productUnits, ingredientsList, temperatureState, packageType, numPackages, ingStorage, totalNumNativeUnits, nativeUnit, numNativeUnitsPerPackage) {

    // Make sure the user is logged in before inserting a task
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    Meteor.call('systemlog.insert', "Intermediate", name, id, "Modified", "")

    Meteor.call('intermediates.editName', id, name)
    Meteor.call('intermediates.editDescription', id, description)
    Meteor.call('intermediates.editProductUnits', id, productUnits)
    Meteor.call('intermediates.editTemperatureState', id, temperatureState)
    Meteor.call('intermediates.editPackageType', id, packageType.toLowerCase())
    Meteor.call('intermediates.editNumNativeUnitsPerPackage', id, Number(numNativeUnitsPerPackage))
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

    Meteor.call('systemlog.insert', "Intermediate", existingFormula.name, id, "Modified", name)


    Intermediates.update({ _id: id }, {
      $set: {
        name: name,
      }
    });
  },
  'intermediates.editDescription'(id, description) {
    let existingFormula = Formulas.findOne({ _id: id }) != undefined ? Formulas.findOne({ _id: id }) : Intermediates.findOne({ _id: id })
    Meteor.call('systemlog.insert', "Intermediate", existingFormula.name, id, "Modified", "")

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
    let existingFormula = Formulas.findOne({ _id: id }) != undefined ? Formulas.findOne({ _id: id }) : Intermediates.findOne({ _id: id })
    Meteor.call('systemlog.insert', "Intermediate", existingFormula.name, id, "Modified", "")


    Intermediates.update({ _id: id }, {
      $set: {
        productUnits: productUnits,
      }
    });
  },
  'intermediates.editTemperatureState'(id, temperatureState) {

    //moving temperature states would change quantities

    check(temperatureState, String);

    //moving temperature states would change quantities
    let existingInt = Intermediates.findOne({ _id: id });

    if (!(existingInt.package == 'truckload' || existingInt.package == 'railcar')) {
        let oldContainer = StorageCapacities.findOne({ type: existingInt.temperatureState });
        let newContainer = StorageCapacities.findOne({ type: temperatureState.toLowerCase() });
        let oldUsed = Number(oldContainer.used) - Number(existingInt.storage);
        let newUsed = Number(newContainer.used) + Number(existingInt.storage);
        Meteor.call('sc.editUsed', newContainer._id, Number(newUsed));
        Meteor.call('sc.editUsed', oldContainer._id, Number(oldUsed));
    }

    let existingFormula = Formulas.findOne({ _id: id }) != undefined ? Formulas.findOne({ _id: id }) : Intermediates.findOne({ _id: id })
    Meteor.call('systemlog.insert', "Intermediate", existingFormula.name, id, "Modified", "")

    Intermediates.update({ _id: id }, {
      $set: {
        temperatureState: temperatureState,
      }
    });
  },
  'intermediates.editPackageType'(id, newPackage) {

    check(newPackage, String);

    //if it is going from truckload or railcar to something else, we have to make sure enough room in storage
    let existingInt = Intermediates.findOne({ _id: id});
    let container = StorageCapacities.findOne({ type: existingInt.temperatureState });

    let packagingMap = new Map();
    packagingMap.set('sack', 0.5);
    packagingMap.set('pail', 1.5);
    packagingMap.set('drum', 3);
    packagingMap.set('supersack', 16);
    packagingMap.set('truckload', 0);
    packagingMap.set('railcar', 0);
    
    //update storage and container
    let newStorage = Number(packagingMap.get(newPackage.toLowerCase())) * Number(existingInt.packageInfo.numPackages)
    let newUsed = 0;
    
    //truck or rail to physical, put in inventory
    if ((existingInt.packageInfo.packageType == 'truckload' || existingInt.packageInfo.packageType == 'railcar') &&
        !(newPackage.toLowerCase() == 'truckload' || newPackage.toLowerCase() == 'railcar')) {
        newUsed = Number(container.used) + Number(newStorage)
    } 
    
    // truck to rail or vice versa, no change
    else if ((existingInt.packageInfo.packageType == 'truckload' || existingInt.packageInfo.packageType == 'railcar') &&
        (newPackage.toLowerCase() == 'truckload' || newPackage.toLowerCase() == 'railcar')) {
    }
    
    //going to truckload, take out of inventory
    else if (newPackage.toLowerCase() == 'truckload' || newPackage.toLowerCase() == 'railcar') {
        newUsed = Number(container.used) - Number(existingInt.storage)
    } 
    
    //regular 
    else {
        newUsed = Number(container.used) - Number(existingInt.storage) + Number(newStorage)
    }

    Meteor.call('sc.editUsed', container._id, Number(newUsed))
    let existingFormula = Formulas.findOne({ _id: id }) != undefined ? Formulas.findOne({ _id: id }) : Intermediates.findOne({ _id: id })
    Meteor.call('systemlog.insert', "Intermediate", existingFormula.name, id, "Modified", "")


    Intermediates.update({ _id: id}, { $set: { storage:  Number(newStorage)} });  

    Intermediates.update({ _id: id }, {
      $set: {
        'packageInfo.packageType': newPackage,
      },

    });

  },
  'intermediates.editNumPackages'(id, numPackages){
    
    check(numPackages, Number);
    let existingInt = Intermediates.findOne({ _id: id });

    let packagingMap = new Map();
    packagingMap.set('sack', 0.5);
    packagingMap.set('pail', 1.5);
    packagingMap.set('drum', 3);
    packagingMap.set('supersack', 16);
    packagingMap.set('truckload', 0);
    packagingMap.set('railcar', 0);

    let existingFormula = Formulas.findOne({ _id: id }) != undefined ? Formulas.findOne({ _id: id }) : Intermediates.findOne({ _id: id })
    Meteor.call('systemlog.insert', "Intermediate", existingFormula.name, id, "Modified", "")

    let newStorage = numPackages * packagingMap.get(existingInt.packageInfo.packageType)
    Meteor.call('intermediates.editStorage', id, Number(newStorage))
    Intermediates.update({ _id: id}, { $set: { "packageInfo.numPackages": Number(numPackages) } });
  },
  'intermediates.editNumNativeUnitsPerPackage'(id, numNativeUnitsPerPackage) {

    //num native units per package must be positive
    if (numNativeUnitsPerPackage <= 0) {
      throw new Meteor.Error('Product Units must be greater than 0', 'Number of Native Units per package must be greater than 0')
    }

    if (typeof numNativeUnitsPerPackage != 'number') {
      throw new Meteor.Error('Number of Native Units Per Package must be an integer', 'Number of Native Units Per Package must be an Integer');
    }

    let existingInt = Intermediates.findOne({ _id: id });

    //edit packages
    let remainingPackages = Math.ceil(Number(existingInt.nativeInfo.totalQuantity) / Number(numNativeUnitsPerPackage))

    Meteor.call('intermediates.editNumPackages', id, Number(remainingPackages))
    
    let existingFormula = Formulas.findOne({ _id: id }) != undefined ? Formulas.findOne({ _id: id }) : Intermediates.findOne({ _id: id })
    Meteor.call('systemlog.insert', "Intermediate", existingFormula.name, id, "Modified", "")
    
    Intermediates.update({ _id: id }, {
      $set: {
        'nativeInfo.numNativeUnitsPerPackage': numNativeUnitsPerPackage,
      }
    });

  },
  'intermediates.editTotalNumNativeUnits'(id, totalNumNativeUnits){
    
    //total native units per package must be positive
    if (totalNumNativeUnits < 0) {
      throw new Meteor.Error('Number of Total Native Units must be greater than 0', 'Number of Total Native Units must be greater than 0');
    }
    let intermediate = Intermediates.findOne({ _id: id });
        
    //re-calculate footprint
    let remainingPackages = Math.ceil(Number(totalNumNativeUnits) / Number(intermediate.nativeInfo.numNativeUnitsPerPackage))
        
    let packagingMap = new Map();
    packagingMap.set('sack', 0.5);
    packagingMap.set('pail', 1.5);
    packagingMap.set('drum', 3);
    packagingMap.set('supersack', 16);
    packagingMap.set('truckload', 0);
    packagingMap.set('railcar', 0);

    let newStorage = remainingPackages * packagingMap.get(intermediate.packageInfo.packageType)
    Meteor.call('intermediates.editStorage', id, Number(newStorage))
    Meteor.call('intermediates.editNumPackages', id, Number(remainingPackages))

    let existingFormula = Formulas.findOne({ _id: id }) != undefined ? Formulas.findOne({ _id: id }) : Intermediates.findOne({ _id: id })
    Meteor.call('systemlog.insert', "Intermediate", existingFormula.name, id, "Modified", "")

    Intermediates.update({ _id: id }, {
      $set: {
        'nativeInfo.totalQuantity': totalNumNativeUnits,
      }
    });
  },
  'intermediates.editStorage'(id, storage){
 
    let intermediate = Intermediates.findOne({ _id: id });

    if (!(intermediate.packageInfo.packageType == 'truckload' || intermediate.packageInfo.packageType == 'railcar')) {
        let container = StorageCapacities.findOne({ type: intermediate.temperatureState });
        let newUsed = Number(container.used) - Number(intermediate.storage) + Number(storage)
        Meteor.call('sc.editUsed', container._id, Number(newUsed));
    }
  
    let existingFormula = Formulas.findOne({ _id: id }) != undefined ? Formulas.findOne({ _id: id }) : Intermediates.findOne({ _id: id })
    Meteor.call('systemlog.insert', "Intermediate", existingFormula.name, id, "Modified", "")

    Intermediates.update({ _id: id }, { $set: { storage : Number(storage) } });
  },
  'intermediates.editNativeUnit'(id, nativeUnit) {
    let existingFormula = Formulas.findOne({ _id: id }) != undefined ? Formulas.findOne({ _id: id }) : Intermediates.findOne({ _id: id })
    Meteor.call('systemlog.insert', "Intermediate", existingFormula.name, id, "Modified", "")

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

      let existingFormula = Formulas.findOne({ _id: id }) != undefined ? Formulas.findOne({ _id: id }) : Intermediates.findOne({ _id: id })
      Meteor.call('systemlog.insert', "Intermediate", existingFormula.name, id, "Removed", "")
      
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
    Meteor.call('productionLines.removeFormula', id)
    Intermediates.remove({ _id: id });
    Lots.remove({ inventoryID : id});
  },
  // 'intermediates.updateTotalSpendin'
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
    let existingFormula = Formulas.findOne({ _id: id }) != undefined ? Formulas.findOne({ _id: id }) : Intermediates.findOne({ _id: id })
    Meteor.call('systemlog.insert', "Intermediate", existingFormula.name, id, "Modified", "")
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