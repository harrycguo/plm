import { Meteor } from 'meteor/meteor';
// import { IngredientsList } from '../imports/api/IngredientList.js';
import '../imports/startup/server';
import '../imports/api/Vendors/vendors.js';


IngredientsList = new Mongo.Collection('ingredients');

//IngredientsList.remove({}) // remove every ingredient from the collection

// //Array for any of our schemas we define
var Schemas = {};

//Specifies ingredient field type constraints
Schemas.Ingredient = new SimpleSchema({
  name: {type: String},
  package: {type: Number},
  temperatureState: {type: String},
  vendors: {type: [Object]}
});

//Attach a schema to the collection for automatic validation on insert/update operations
IngredientsList.attachSchema(Schemas.Ingredient);

//IngredientsList API
Meteor.methods({
    'addIngredient': function(ingredientName,ingredientPackage,ingredientTemperatureState,ingredientVendors){
        //var currentUserId = Meteor.userId();
        var currentUserId = Meteor.userId;
        //Only allow adding ingredients if admin user ID. Add check for currentUserId = adminId
        IngredientsList.insert({
            name: ingredientName,
            package: ingredientPackage,
            temperatureState: ingredientTemperatureState,
            vendors: ingredientVendors
        });
    },
    'removeIngredient': function(selectedIngredient) {
    	check(selectedIngredient, String);//Ensure the argument is a string
    	var currentUserId = Meteor.userId;
    	//Add a check for admin. If not, don't allow deletion.
    	IngredientsList.remove({_id: selectedIngredient});
    },
    'editName': function(selectedIngredient,newName) {
    	check(selectedIngredient, String);
    	//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
    	check(newName,String);
    	IngredientsList.update({ _id: selectedIngredient},{$set : {name: newName}});
    },
    'editPackage': function(selectedIngredient,newPackage) {
    	check(selectedIngredient, String);
    	IngredientsList.update({ _id: selectedIngredient},{$set : {package: newPackage}});
    },
    'editTemperatureState': function(selectedIngredient,newTemperatureState) {
    	check(selectedIngredient, String);
    	//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
    	check(newTemperatureState,String);
    	IngredientsList.update({ _id: selectedIngredient},{$set : {temperatureState: newTemperatureState}});
    },
    'editVendors': function(selectedIngredient,newVendors) {
    	check(selectedIngredient, String);
    	IngredientsList.update({ _id: selectedIngredient},{$set : {vendors: newVendors}});
    }
});

//Make data visible to all subscribers on the client side
Meteor.publish('ingredients', function() {
  return IngredientsList.find()
});

Meteor.startup(() => {
  // code to run on server at startup
});
