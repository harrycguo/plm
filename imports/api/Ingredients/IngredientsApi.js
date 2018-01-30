import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import convertPackageString from '../../utils/conversions.js';

const packagingTypes = ["sack","pail","drum","supersack","truckload","railcar"];
const temperatureStates = ["frozen","refrigerated","room temperature"];

//IngredientsList API
Meteor.methods({
    'addIngredient': function(ingredientName,ingredientPackage,ingredientTemperatureState,ingredientVendors,ingredientQuantity){
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		IngredientsList.insert({
            	name: ingredientName,
            	package: ingredientPackage,
            	temperatureState: ingredientTemperatureState,
            	vendors: ingredientVendors,
                quantity: ingredientQuantity
        	});
    	// }
    },
    'removeIngredient': function(selectedIngredient) {
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		// check(selectedIngredient, String);//Ensure the argument is a string
    		var currentUserId = Meteor.userId;
    		//Add a check for admin. If not, don't allow deletion.
    		IngredientsList.remove({_id: selectedIngredient});
    	// }
    },
    'editName': function(selectedIngredient,newName) {
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		check(selectedIngredient, String);
    		//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
    		check(newName,String);
    		IngredientsList.update({ _id: selectedIngredient},{$set : {name: newName}});
    	
    },
    'editPackage': function(selectedIngredient,newPackage) {
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		check(selectedIngredient, String);
    		//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
    		check(newPackage,String);
            if (packagingTypes.contains(newPackage.toLowerCase())) {
                ingredientsList.update({ _id: selectedIngredient},{$set : {package: newPackage}});
            }
    },
    'editTemperatureState': function(selectedIngredient,newTemperatureState) {
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		check(selectedIngredient, String);
    		//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
    		check(newTemperatureState,String);
            if (temperatureStates.contains(newTemperatureState.toLowerCase())) {
                IngredientsList.update({ _id: selectedIngredient},{$set : {temperatureState: newTemperatureState}});
            }    	
    },
    'editVendors': function(selectedIngredient,newVendors) {
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		check(newVendors,String);
    		IngredientsList.update({ _id: selectedIngredient},{$set : {vendors: newVendors}});
    	
    },
    'editQuantity': function(selectedIngredient,newQuantity) {
        // if (Roles.userIsInRole( Meteor.userId(),'admin')) {
            var package = IngredientsList.find({_id: selectedIngredient}).package;
            check(selectedIngredient, String);
            //Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
            check(newQuantity,Number);
            if (newQuantity % convertPackageString(package) == 0) {
                IngredientsList.update({ _id: selectedIngredient},{$set : {quantity: newQuantity}});
            }
    }
});