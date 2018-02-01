import { Mongo } from 'meteor/mongo';
import convertPackageString from '../../utils/conversions.js';

IngredientsList = new Mongo.Collection('ingredients');
//IngredientsList.remove({}) // remove every ingredient from the collection

//Array for any of our schemas we define
var Schemas = {};

//Specifies ingredient field type constraints
Schemas.Ingredient = new SimpleSchema({
  name: {
    type: String,
    unique: true //ensures only one database entry for each ingredient name
  },
  package: {
    type: String,
    allowedValues: ["sack","pail","drum","supersack","truckload","railcar"]
  },
  temperatureState: {
    type: String,
    allowedValues: ["frozen","refrigerated","room temperature"]
  },
  vendors: {
    type: [Object], 
    minCount: 1,
    blackbox: true //You need this so that the data isn't autocleaned out by the schema 
                   // or you can register the object schema manually.
  },
  numPackages: {
    type: Number, 
    min: 1
  },
  quantity: {
    type: Number, 
    min: 1
  },
  prices: {
    type: [Object],
    minCount: 1,
    blackbox: true
  }
});

//Attach a schema to the collection for automatic validation on insert/update operations
IngredientsList.attachSchema(Schemas.Ingredient);

//The below code listens for changes to an ingredient and updates the quantity for that ingredient appropriately
var cursor = IngredientsList.find();
const handle = cursor.observeChanges({
    'changed': function(id, ingredient) {
       // This code runs when a new object "object" was added to collection.
       var ing = IngredientsList.find({ _id: id}).fetch();
       console.log(ing);
       var newQty = convertPackageString(ing[0].package) * ing[0].numPackages;
       IngredientsList.update({ _id : id}, { $set : { quantity : newQty}});
    }
});

export default IngredientsList;

if(Meteor.isServer) {
	console.log('publishing ings')
	Meteor.publish('ingredients', function() {
		return IngredientsList.find();
	})
}