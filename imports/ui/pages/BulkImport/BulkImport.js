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
import AdminViewInventoryNavBar from '../../components/AdminViewInventoryNavBar/AdminViewInventoryNavBar.js'

// App component - represents the whole app
class BulkImport extends Component {
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
      Bert.alert('File Format is Incorrect', 'danger');
      
      let errors = this.checkFileForErrors(data).errors
      let message = ""
      for (let i = 0; i < errors.length; i++){
        message += errors[i].toString() + "\n"
      }
      this.setState({ errorMessage: message})
      data = undefined;
    }

    // Success!!
    else {

      let dataFile = data;
      for (let i = 0; i < dataFile.data.length; i++) {

        let currIngName = dataFile.data[i]["INGREDIENT"].toLowerCase();
        let currIngPackage = dataFile.data[i]["PACKAGE"].toLowerCase();
        let currIngTemp = dataFile.data[i]["TEMPERATURE"].toLowerCase();
        let currIngAmt = dataFile.data[i]["AMOUNT (LBS)"];
        let currIngPricePerPackage = dataFile.data[i]["PRICE PER PACKAGE"];
        let currIngFCC = dataFile.data[i]["VENDOR FREIGHT CODE"];

        for (var j = 0; j < this.props.vendors.length; j++) {
          if (this.props.vendors[j].FCC == currIngFCC) {
            vendor = this.props.vendors[j];
            break;
          }
        }

        Meteor.call("addToExistingIngredient",
          currIngName,
          currIngPackage,
          currIngAmt,
          currIngTemp,
          vendor,
          currIngPricePerPackage,
          function (error, result) {
            if (error) {
              Bert.alert(error.reason, 'danger');
            }
          });
      }
      Bert.alert("Successfully Bulk Imported", 'success');
      history.push('/adminViewInventory')
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
    let vendorFCCArray = Array();
    for (let i = 0; i < this.props.vendors.length; i++) {
      vendorFCCArray.push(this.props.vendors[i].FCC);
    }

    //Create array of vendors of storage capacities
    let scMapUsed = new Map();
    let scMapTotal = new Map();

    for (let i = 0; i < this.props.sc.length; i++) {
      scMapUsed.set(this.props.sc[i].type, Number(this.props.sc[i].used))
      scMapTotal.set(this.props.sc[i].type, Number(this.props.sc[i].capacity))
    }

    //Create array of ingredients
    let ingMap = new Map();
    for (let i = 0; i < this.props.ingredients.length; i++) {
      ingMap.set(this.props.ingredients[i].name, {
        package: this.props.ingredients[i].package,
        temperatureState: this.props.ingredients[i].temperatureState
      })
    }


    //Check headers
    let headers = ["INGREDIENT", "PACKAGE", "AMOUNT (LBS)", "PRICE PER PACKAGE", "VENDOR FREIGHT CODE", "TEMPERATURE"]
    let checkHeaders = Array();
    let headersValid = this.arraysEqual(headers, dataFile.meta.fields)

    if (!headersValid) {
      errors.push("Header Formatting Is Incorrect \n" + 
      "Please check to make sure there are no extra white spaces and that headers match exactly \n" +
      "[INGREDIENT, PACKAGE, AMOUNT (LBS), PRICE PER PACKAGE, VENDOR FREIGHT CODE, TEMPERATURE].\n" +
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

      let currIngName = dataFile.data[i]["INGREDIENT"].toLowerCase();
      let currIngPackage = dataFile.data[i]["PACKAGE"].toLowerCase();
      let currIngTemp = dataFile.data[i]["TEMPERATURE"].toLowerCase();
      let currIngAmt = dataFile.data[i]["AMOUNT (LBS)"];
      let currIngPricePerPackage = dataFile.data[i]["PRICE PER PACKAGE"];
      let currIngFCC = dataFile.data[i]["VENDOR FREIGHT CODE"];

      //ingredient currently in the database
      if (ingMap.has(currIngName)) {

        let existingIng = ingMap.get(currIngName);

        //check for valid temp state
        if (currIngTemp != existingIng.temperatureState || !temperatures.includes(currIngTemp)) {
          errors.push("Ingredient is in the database already, but temperature is incorrect. Should be " + existingIng.temperatureState + " on Line " + Number(i + 2))
        } else {
          if (typeof currIngAmt != 'number') {
            errors.push("Invalid Amount (lbs) on Line " + Number(i + 2))
          } else {
            scMapUsed.set(currIngTemp, Number(scMapUsed.get(currIngTemp) + Number(currIngAmt)))
          }
        }

        //check for valid package type
        if (currIngPackage != existingIng.package || !packageTypes.includes(currIngPackage)) {
          errors.push("Ingredient is in the database already, but package type is incorrect. Should be " + existingIng.package + " on Line " + Number(i + 2))
        }

      } else {
        //check for valid package type
        if (!packageTypes.includes(currIngPackage)) {
          errors.push("Invalid package type on Line " + Number(i + 2))
        }

        //check for valid temp state
        if (!temperatures.includes(currIngTemp)) {
          errors.push("Invalid temperature type on Line " + Number(i + 2))
        } else {
          if (typeof currIngAmt != 'number') {
            errors.push("Invalid Amount (lbs) on Line " + Number(i + 2))
          } else {
            scMapUsed.set(currIngTemp, Number(scMapUsed.get(currIngTemp) + Number(currIngAmt)))
          }
        }
      }

      //check vendor
      if (!vendorFCCArray.includes(currIngFCC)) {
        errors.push("Vendor does not exist in the database. Error on line " + Number(i + 2))
      }

      //check to see if price valid
      if (typeof currIngPricePerPackage != 'number') {
        errors.push("Invalid price per package on Line " + Number(i + 2))
      }
    }

    // check capacities
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
    return  (
      <div className="verticalList">
        <b>Errors:</b>
        <p className="redFont">{this.state.errorMessage}</p>
      </div>
    )
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Bulk Import</h1>
        </header>
        <AdminViewInventoryNavBar/>
        <hr></hr>
        <b>Upload File Below</b>

        <p>
          <input type="file"
            name="myFile"
            onChange={this.uploadFile} />
        </p>

        <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
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
})(BulkImport);





