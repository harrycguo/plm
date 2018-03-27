import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormGroup, ControlLabel } from 'react-bootstrap';
import validate from '../../../modules/validate';
import Papa from 'papaparse'
import { Bert } from 'meteor/themeteorchef:bert';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientList from '../../../api/Ingredients/IngredientList.js';
import { Vendors } from '../../../api/Vendors/vendors.js';
import { StorageCapacities } from '../../../api/StorageCapacities/storageCapacities.js';
import { check } from 'meteor/check';
import InventoryManagementNavBar from '../../components/InventoryManagementNavBar/InventoryManagementNavBar.js'

// App component - represents the whole app
class BulkImportIngredients extends Component {
  constructor(props) {
    super(props);
    this.uploadFile = this.uploadFile.bind(this);
    this.checkFileForErrors = this.checkFileForErrors.bind(this);
    this.arraysEqual = this.arraysEqual.bind(this)
    var data = undefined;
    var isCSV;
    var file = undefined
    this.state = {
      errorMessage: ""
    }
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        fileUp: {
          required: true,
          file: true,
        },

      },
      messages: {
        fileUp: {
          required: 'Need a File.',
          file: 'Is this the correct format?',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {

    const { history } = this.props;

    // If there is no file
    if (typeof data == 'undefined') {
      Bert.alert('Need To Submit A CSV File', 'danger');
      this.setState({ errorMessage: "No File Submitted" })
      data = undefined;
    }

    // if file is not a CSV
    else if (!isCSV) {
      Bert.alert('File must be CSV', 'danger');
      this.setState({ errorMessage: "File must be CSV" })
      data = undefined;
    }

    // if File is not valid
    else if (!this.checkFileForErrors(data).valid) {
      Bert.alert('File Formatting is Incorrect, Please Clear All Errors From File', 'danger');

      let errors = this.checkFileForErrors(data).errors
      let message = ""
      for (let i = 0; i < errors.length; i++) {
        message += errors[i].toString() + "\n"
      }
      this.setState({ errorMessage: message })
      data = undefined;
    }

    // Success!!
    else {

      let dataFile = data;

      console.log('time to Bulk Import Ingredient!')

      // Create array of vendors to look up
      let vendorFCCMap = new Map();
      for (let i = 0; i < this.props.vendors.length; i++) {
        vendorFCCMap.set(this.props.vendors[i].FCC, this.props.vendors[i]);
      }

      //Create array of ingredients
      let ingMap = new Map();
      for (let i = 0; i < this.props.ingredients.length; i++) {
        ingMap.set(this.props.ingredients[i].name, this.props.ingredients[i])
      }

      for (let i = 0; i < dataFile.data.length; i++) {

        let currIngName = dataFile.data[i]["INGREDIENT"];
        let currIngPackage = dataFile.data[i]["PACKAGE"].toLowerCase()

        let currIngNativeUnit = dataFile.data[i]["NATIVE UNIT"]
        let currIngNumNativeUnitsPerPackage = dataFile.data[i]["UNITS PER PACKAGE"]
        let currIngPricePerPackage = dataFile.data[i]["PRICE PER PACKAGE"];
        let currIngFCC = dataFile.data[i]["VENDOR FREIGHT CODE"].toUpperCase()
        let currIngTemp = dataFile.data[i]["TEMPERATURE"].toLowerCase()

        let vendorID = null
        if (vendorFCCMap.has(currIngFCC)) {
          let vendor = vendorFCCMap.get(currIngFCC)
          vendorID = vendor._id
        } else {
          vendorID = {}
        }
        


        let ingredient = ingMap.get(currIngName)

        let numPackages = Math.ceil(Number(0) / Number(currIngNumNativeUnitsPerPackage))

        //packaging map to reference weights
        let packagingMap = new Map();
        packagingMap.set('sack', 0.5);
        packagingMap.set('pail', 1.5);
        packagingMap.set('drum', 3);
        packagingMap.set('supersack', 16);
        packagingMap.set('truckload', 0);
        packagingMap.set('railcar', 0);
       
        let ingredientStorage = packagingMap.get(currIngPackage) * Number(numPackages)

        Meteor.call("addToExistingIngredientBulk",
          currIngName,
          currIngTemp,
          currIngPackage,
          numPackages,
          Number(ingredientStorage),
          Number(0),
          currIngNativeUnit,
          Number(currIngNumNativeUnitsPerPackage),
          vendorID,
          currIngPricePerPackage,
          function (error, result) {
            if (error) {
              Bert.alert(error.reason, 'danger');
            }
          })

        if (ingMap.has(currIngName)) {
          let existingIng = ingMap.get(currIngName)
          let newTotalNumNativeUnits = existingIng.nativeInfo.totalQuantity + 0
          Meteor.call('editTotalNumNativeUnits', existingIng._id, newTotalNumNativeUnits)
        }
      }
      Bert.alert("Successfully Bulk Imported Ingredients!", 'success');
      this.setState({ errorMessage: "" })
      document.getElementById("form").reset();
      document.getElementById("myInput").value = "";
    }
  }

  uploadFile(event) {

    file = event.target.files[0];

    // is CSV checker
    if (file.type != 'text/csv') {
      Bert.alert('File must be a CSV', 'danger');
      isCSV = false;
    } else {
      isCSV = true;
    }

    // Parse the file
    Papa.parse(file, {
      dynamicTyping: true,
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        data = results
        console.log(data)
      }
    });


  }

  checkFileForErrors(dataFile) {

    let errors = [];

    if (!isCSV) {
      return {
        valid: false,
        errors: errors
      };
    }

    // Create array of vendors to look up
    let vendorFCCMap = new Map();
      for (let i = 0; i < this.props.vendors.length; i++) {
        vendorFCCMap.set(this.props.vendors[i].FCC, this.props.vendors[i]);
      }

    //Create array of storage capacities
    let scMapUsed = new Map();
    let scMapTotal = new Map();

    for (let i = 0; i < this.props.sc.length; i++) {
      scMapUsed.set(this.props.sc[i].type, Number(this.props.sc[i].used))
      scMapTotal.set(this.props.sc[i].type, Number(this.props.sc[i].capacity))
    }

    //Create array of ingredients
    let ingMap = new Map();
    for (let i = 0; i < this.props.ingredients.length; i++) {
      ingMap.set(this.props.ingredients[i].name, this.props.ingredients[i])
    }

    //packaging map to reference weights
    let packagingMap = new Map();
    packagingMap.set('sack', 0.5);
    packagingMap.set('pail', 1.5);
    packagingMap.set('drum', 3);
    packagingMap.set('supersack', 16);
    packagingMap.set('truckload', 0);
    packagingMap.set('railcar', 0);


    //Check headers
    let headers = ["INGREDIENT", "PACKAGE", "NATIVE UNIT", "UNITS PER PACKAGE", "PRICE PER PACKAGE", "VENDOR FREIGHT CODE", "TEMPERATURE"]
    let headersValid = this.arraysEqual(headers, dataFile.meta.fields)

    if (!headersValid) {
      errors.push("Header Formatting Is Incorrect \n" +
        "Please check to make sure there are no extra white spaces and that headers match exactly \n" +
        "[INGREDIENT, PACKAGE, NATIVE UNIT, UNITS PER PACKAGE, PRICE PER PACKAGE, VENDOR FREIGHT CODE, TEMPERATURE].\n" +
        "After this is complete, our program will check the rest of the CSV")

      //return header error
      return {
        valid: false,
        errors: errors
      };
    }

    //package types
    const packageTypes = ['pail', 'sack', 'drum', 'supersack', 'truckload', 'railcar']
    const temperatures = ['frozen', 'refrigerated', 'room temperature']

    //Check line by line
    for (let i = 0; i < dataFile.data.length; i++) {

      let currIngName = dataFile.data[i]["INGREDIENT"];
      let currIngPackage = dataFile.data[i]["PACKAGE"].toLowerCase();
      let currIngNativeUnit = dataFile.data[i]["NATIVE UNIT"];
      let currIngNumNativeUnitsPerPackage = dataFile.data[i]["UNITS PER PACKAGE"]
      let currIngPricePerPackage = dataFile.data[i]["PRICE PER PACKAGE"];
      let currIngFCC = dataFile.data[i]["VENDOR FREIGHT CODE"].toUpperCase();
      let currIngTemp = dataFile.data[i]["TEMPERATURE"].toLowerCase();

      //ingredient currently in the database
      if (ingMap.has(currIngName)) {

        let existingIng = ingMap.get(currIngName);

        //check for valid package type
        if (currIngPackage != existingIng.packageInfo.packageType || !packageTypes.includes(currIngPackage)) {
          errors.push("Ingredient is in the database already, but PACKAGE type is incorrect. Should be " + existingIng.packageInfo.packageType + " on Line " + Number(i + 2))
        }

        //check for valid native Unit
        if (currIngNativeUnit != existingIng.nativeInfo.nativeUnit) {
          errors.push("Ingredient is in the database already, but NATIVE UNIT is incorrect. Should be " + existingIng.nativeInfo.nativeUnit + " on Line " + Number(i + 2))
        }

        //check for valid num native units per package
        if (currIngNumNativeUnitsPerPackage != existingIng.nativeInfo.numNativeUnitsPerPackage || typeof currIngNumNativeUnitsPerPackage != 'number' || currIngNumNativeUnitsPerPackage <= 0) {
          errors.push("Ingredient is in the database already, but UNITS PER PACKAGE is incorrect. Should be " + existingIng.nativeInfo.numNativeUnitsPerPackage + " on Line " + Number(i + 2))
        }

        //check for valid temp state
        if (currIngTemp != existingIng.temperatureState || !temperatures.includes(currIngTemp)) {
          errors.push("Ingredient is in the database already, but TEMPERATURE is incorrect. Should be " + existingIng.temperatureState + " on Line " + Number(i + 2))
        }

        //Update storage capacity if everything else is correct
        else {
          if (currIngNativeUnit == existingIng.nativeInfo.nativeUnit && currIngNumNativeUnitsPerPackage == existingIng.nativeInfo.numNativeUnitsPerPackage && typeof currIngNumNativeUnitsPerPackage == 'number') {

            let newTotalNumNativeUnits = existingIng.nativeInfo.totalQuantity
            let newNumPackages = Math.ceil(Number(newTotalNumNativeUnits) / Number(currIngNumNativeUnitsPerPackage))
            let change = Number(packagingMap.get(currIngPackage) * existingIng.numPackages) - Number(packagingMap.get(currIngPackage) * newNumPackages)

            scMapUsed.set(currIngTemp, Number(scMapUsed.get(currIngTemp) + Number(change)))
          }
        }
      }

      //Ing not in database
      else {
        //check for valid package type
        if (!packageTypes.includes(currIngPackage)) {
          errors.push("Invalid PACKAGE on Line " + Number(i + 2))
        }

        //check for valid num units per package
        if (typeof currIngNumNativeUnitsPerPackage != 'number' || currIngNumNativeUnitsPerPackage <= 0) {
          errors.push("Invalid UNITS PER PACKAGE on Line " + Number(i + 2))
        }

        //check for valid temp state
        if (!temperatures.includes(currIngTemp)) {
          errors.push("Invalid TEMPERATURE on Line " + Number(i + 2))
        }

        //Update storage capacity if everything else is correct
        else {
          if (typeof currIngNumNativeUnitsPerPackage == 'number') {

            let numPackages = Math.ceil(Number(0) / Number(currIngNumNativeUnitsPerPackage))
            let change = Number(packagingMap.get(currIngPackage) * numPackages)
            scMapUsed.set(currIngTemp, Number(scMapUsed.get(currIngTemp) + Number(change)))
          }
        }

      }

      //if both are not empty
      if (currIngFCC.length != 0 && currIngPricePerPackage != 0){

        //check vendor CHECK
        if (!vendorFCCMap.has(currIngFCC)) {
          errors.push("VENDOR FREIGHT CODE does not exist in the database. Error on line " + Number(i + 2))
        } 

        //check to see if price valid CHECK
        if (typeof currIngPricePerPackage != 'number' || currIngPricePerPackage <= 0) {
          errors.push("Invalid PRICE PER PACKAGE on Line " + Number(i + 2))
        }
      } else if (currIngFCC.length == 0 && currIngPricePerPackage == 0){
        
      } else {
        errors.push('VENDOR FREIGHT CODE and PRICE PER PACKAGE must be both filled or both empty. Error on line ' + Number(i + 2))
      }


    }

    // check capacities CHECK
    for (let i = 0; i < temperatures.length; i++) {
      if (Number(scMapUsed.get(temperatures[i])) > Number(scMapTotal.get(temperatures[i]))) {
        errors.push("Exceeded capacity with this bulk import in the " + temperatures[i] + " storage facility")
      }
    }

    // return 
    return {
      valid: errors.length == 0 ? true : false,
      errors: errors
    };
  }

  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
      return false;
    for (var i = arr1.length; i--;) {
      if (arr1[i] !== arr2[i])
        return false;
    }
    return true;
  }

  renderErrors() {
    return (
      <div className="verticalList">
        <b>Errors:</b>
        <p className="redFont">{this.state.errorMessage}</p>
      </div>
    )
  }

  render() {
    return (
      <div>

        <p></p>
        <b>Format:</b>
        <p>The bulk import ingredients feature only supports .csv files. You can make your spreadsheet in Excel and when saving, simply "Save As" a ".csv" file. </p>
        
        <p><b>Headers:</b>
        <br></br>INGREDIENT: Name of Ingredient To Be Added (can be pre-existing)
        <br></br>PACKAGE: Type of Package from [sack, pail, drum, supersack, truckload, railcar]
        <br></br>NATIVE UNIT: The native unit of the ingredient
        <br></br>UNITS PER PACKAGE: Number of native units per package
        <br></br>PRICE PER PACKAGE: Price per package of ingredient
        <br></br>VENDOR FREIGHT CODE: Freight Code of Vendor that sells ingredient (Vendor MUST be pre-existing)
        <br></br>TEMPERATURE: temperature state of ingredient from [frozen, refrigerated, room temperature]
        </p>

        <b>Example:</b>
        <div>
        <img src={"bulkImportIngredients.png"} width="790" height="133"/>
        </div>
        
        <p></p>
        <b>Upload File Below</b>

        <p>
          <input type="file"
            name="myFile"
            onChange={this.uploadFile}
            id='myInput' />
        </p>

        <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()} id='form'>
          <Button type="submit" bsStyle="success">Import</Button>
        </form>

        <p></p>
        {this.renderErrors()}
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('vendors');
  Meteor.subscribe('storageCapacities');
  Meteor.subscribe('ingredients');
  return {
    vendors: Vendors.find({}).fetch(),
    sc: StorageCapacities.find({}).fetch(),
    ingredients: IngredientList.find({}).fetch(),
  };
})(BulkImportIngredients);





