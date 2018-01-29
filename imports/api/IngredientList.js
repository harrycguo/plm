import { Mongo } from 'meteor/mongo';

IngredientsList = new Mongo.Collection('ingredients');
//IngredientsList.remove({}) // remove every ingredient from the collection

// //Array for any of our schemas we define
var Schemas = {};

//Specifies ingredient field type constraints
Schemas.Ingredient = new SimpleSchema({
  name: {type: String},
  package: {type: Number},
  temperatureState: {type: String},
  vendors: {type: [Object]},
  quantity: {type: Number}
});

//Attach a schema to the collection for automatic validation on insert/update operations
IngredientsList.attachSchema(Schemas.Ingredient);

//IngredientsList API
Meteor.methods({
    'addIngredient': function(ingredientName,ingredientPackage,ingredientTemperatureState,ingredientVendors){
    	if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		IngredientsList.insert({
            	name: ingredientName,
            	package: ingredientPackage,
            	temperatureState: ingredientTemperatureState,
            	vendors: ingredientVendors
        	});
    	}
    },
    'removeIngredient': function(selectedIngredient) {
    	if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		check(selectedIngredient, String);//Ensure the argument is a string
    		var currentUserId = Meteor.userId;
    		//Add a check for admin. If not, don't allow deletion.
    		IngredientsList.remove({_id: selectedIngredient});
    	}
    },
    'editName': function(selectedIngredient,newName) {
    	if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		check(selectedIngredient, String);
    		//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
    		check(newName,String);
    		IngredientsList.update({ _id: selectedIngredient},{$set : {name: newName}});
    	}
    },
    'editPackage': function(selectedIngredient,newPackage) {
    	if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		check(selectedIngredient, Number);
    		//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
    		check(newPackage,String);
    		IngredientsList.update({ _id: selectedIngredient},{$set : {name: newPackage}});
    	}
    },
    'editTemperatureState': function(selectedIngredient,newTemperatureState) {
    	if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		check(selectedIngredient, String);
    		//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
    		check(newTemperatureState,String);
    		IngredientsList.update({ _id: selectedIngredient},{$set : {name: newTemperatureState}});
    	}
    },
    'editVendors': function(selectedIngredient,newVendors) {
    	if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		check(newVendors,String);
    		IngredientsList.update({ _id: selectedIngredient},{$set : {name: newVendors}});
    	}
    }
});

export default IngredientsList;