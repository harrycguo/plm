import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormGroup, ControlLabel } from 'react-bootstrap';
import validate from '../../../modules/validate';
import Papa from 'papaparse'
import { Bert } from 'meteor/themeteorchef:bert';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientList from '../../../api/Ingredients/IngredientList.js';
import  Formulas  from '../../../api/Formulas/formulas.js'
import { Intermediates } from '../../../api/Intermediates/intermediates.js'
import { check } from 'meteor/check';
import FormulaManagementNavBar from '../../components/FormulaManagementNavBar/FormulaManagementNavBar.js'

class BulkImportFinalProduct extends Component {
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
      let formulas = this.checkFileForErrors(data).formulaArray

      for (let i = 0; i < formulas.length; i++) {
        Meteor.call('formulas.insert',
            formulas[i].formulaName,
            formulas[i].formulaDesc,
            formulas[i].formulaProdUnits,
            formulas[i].ingredientsList,
            function(error, result) {
                if (error){
                    Bert.alert(error.reason, 'danger');
                } 
            })
      }

      Bert.alert("Successfully Bulk Imported Formulas!", 'success');
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

    // Create array of formulas to look up
    let formulaNameArray = []    
    for (let i = 0; i < this.props.formulas.length; i++) {
      formulaNameArray.push(this.props.formulas[i].name);
    }

    //Create array of ingredients
    let ingMap = new Map();
    for (let i = 0; i < this.props.ingredients.length; i++) {
      ingMap.set(this.props.ingredients[i].name, this.props.ingredients[i])
    }

    for (let i = 0; i < this.props.intermediates.length; i++){
      ingMap.set(this.props.intermediates[i].name, this.props.intermediates[i])
      formulaNameArray.push(this.props.intermediates[i].name);
    }

    //Check headers
    let headers = ["NAME", "PRODUCT UNITS", "DESCRIPTION", "INGREDIENT", "INGREDIENT UNITS"]
    let headersValid = this.arraysEqual(headers, dataFile.meta.fields)

    if (!headersValid) {
      errors.push("Header Formatting Is Incorrect \n" +
        "Please check to make sure there are no extra white spaces and that headers match exactly \n" +
        "[NAME, PRODUCT UNITS, DESCRIPTION, INGREDIENT, INGREDIENT UNITS].\n" +
        "After this is complete, our program will check the rest of the CSV")

      //return header error
      return {
        valid: false,
        errors: errors
      };
    }

    let formulaNameSet = new Set()
    let formulaArray = []
    let currFormulaName = ""

    //Check line by line
    for (let i = 0; i < dataFile.data.length; i++) {

      let formulaName = dataFile.data[i]["NAME"]
      let productUnits = dataFile.data[i]["PRODUCT UNITS"]
      let description = dataFile.data[i]["DESCRIPTION"]
      let ingredient = dataFile.data[i]["INGREDIENT"] 
      let ingredientUnits = dataFile.data[i]["INGREDIENT UNITS"]   

      //if formula name shows up twice on csv
      if (formulaNameSet.has(formulaName) && currFormulaName != formulaName) {
        errors.push("Have Duplicate In NAME: " + formulaName + " on Line " + Number(i + 2) + ". Please merge into one Formula")
      } 

      //if formula name already exists
      if (formulaNameArray.includes(formulaName)) {
        errors.push("Formula: " + formulaName + " already exists in Formula Database")
      }

      //add formula name to array
      if (formulaName.length != 0 && currFormulaName!= formulaName) {
        formulaNameSet.add(formulaName)
        formulaArray.push(formulaName)
      }

      //Check product units for type and length
      if (productUnits.length != 0 && currFormulaName!= formulaName){
        if (typeof productUnits != 'number' || productUnits % 1 !== 0) {
        errors.push("Invalid PRODUCT UNITS on Line " + Number(i + 2))
      } 
      else if(productUnits <= 0){
        errors.push("Invalid PRODUCT UNITS on Line " + Number(i + 2) + ". Must be greater than 0")
      }
      else {
          formulaArray.push(productUnits)
        }
      }

      //check description length
      if (description.length != 0 && currFormulaName!= formulaName){
        formulaArray.push(description)
      }

      //check to see if ingredient
      if (!ingMap.has(ingredient)){
        errors.push("Invalid INGREDIENT on Line " + Number(i + 2) + ". Does not exist in Ingredient Database" )
      } else {
        formulaArray.push(ingredient)
      }

      //check type of units
      if (typeof ingredientUnits != 'number') {
        errors.push("Invalid INGREDIENT UNITS on Line " + Number(i + 2))
      } else {
        formulaArray.push(ingredientUnits)
      }
      currFormulaName = formulaName
    }

    console.log(formulaArray)

    if (errors.length > 0) {
      return {
        valid: errors.length == 0 ? true : false,
        errors: errors,
      };
    }

    //organize formulas if no errors at this point
    let organizedFormulaArray = []
    let tracker = -1;
    for (let i = 0; i < formulaArray.length; i++){
      if (formulaNameSet.has(formulaArray[i])) {
        tracker++
        organizedFormulaArray.push({
          formulaName: formulaArray[i],
          formulaDesc: formulaArray[i + 2],
          formulaProdUnits: Number(formulaArray[i + 1]),
          ingredientsList: []
        })
        i = i + 2
      } 
      else {
        organizedFormulaArray[tracker].ingredientsList.push({
          id: ingMap.get(formulaArray[i])._id,
          amount: Number(formulaArray[i + 1])
        })
        i = i + 1
      }
    }

    console.log(organizedFormulaArray)

    for (let i = 0; i < organizedFormulaArray.length; i++){
      let ingredientsList = organizedFormulaArray[i].ingredientsList
      let ingListSet = new Set()

      for (let j = 0; j < ingredientsList.length; j++){
        ingListSet.add(ingredientsList[j].id)
      }

      if (ingListSet.size < ingredientsList.length) {
        errors.push("Duplicate ingredients for Formula: " + organizedFormulaArray[i].formulaName )
      }

      ingListSet.clear()

    }

    // return 
    return {
      valid: errors.length == 0 ? true : false,
      errors: errors,
      formulaArray: organizedFormulaArray
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
        <p>The bulk import formulas feature only supports .csv files. You can make your spreadsheet in Excel and when saving, simply "Save As" a ".csv" file. </p>
        
        <p><b>Headers:</b>
        <br></br>NAME: Unique name of formula being added (cannot be pre-existing)
        <br></br>PRODUCT UNITS: Number of product units this formula will produce
        <br></br>DESCRIPTION: description of formula
        <br></br>INGREDIENT: name of ingredient used for formula
        <br></br>INGREDIENT UNITS: Number of ingredient native units used in the formula
        <br></br>*NAME, PRODUCT UNITS, DESCRIPTION are only specified once per formula. Also, no duplicates within a single file
        <br></br>*Production Lines are added by managers in Production Line Management
        </p>

        <b>Example:</b>
        <div>
        <img src={"bulkImportFormulas.png"} width="560" height="125"/>
        </div>
      
        <p></p>
        <b>Upload File Below</b>


        <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()} id='form'>
        <input type="file"
            name="myFile"
            onChange={this.uploadFile}
            id='myInput' />
            <p></p>
          <Button type="submit" bsStyle="success">Import</Button>
        </form>

        <p></p>
        {this.renderErrors()}
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('formulas')
  Meteor.subscribe('ingredients')
  Meteor.subscribe('intermediates')
  return {
    formulas: Formulas.find({}).fetch(),
    ingredients: IngredientList.find({}).fetch(),
    intermediates: Intermediates.find({}).fetch()
  };
})(BulkImportFinalProduct);





