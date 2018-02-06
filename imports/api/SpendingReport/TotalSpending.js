//Total spending
import { Mongo } from 'meteor/mongo';
import { IngredientSchema } from './Schemas.js';
import { Vendors } from '../Vendors/vendors.js';
import { SpendingSchema } from '../Ingredients/Schemas.js';
import Report from './Report.js';

if (Meteor.isClient) {
	Meteor.subscribe('report');
}

TotalSpending = new Mongo.Collection('spending');

//Attach a schema to the collection for automatic validation on insert/update operations
TotalSpending.attachSchema(SpendingSchema);

var cursor = Report.find();
const handle = cursor.observeChanges({
    'changed': function(id, report) {
       // This code runs when a new object "object" was added to collection.
       if (Report.find().fetch().length === 0) {
       	  TotalSpending.insert({
       	  	productionTotal: 0,
       	  	total: 0
       	  })
       }

       var total = 0;
       var totalProduction = 0;
       Report.find().fetch().forEach(function(rep) {
       	  if (rep.type == 'In Production') {
       	  	total += (rep.price * rep.quantity);
       	  	totalProduction += (rep.price * rep.quantity);
       	  }
       	  else {
       	  	total += (rep.price * rep.quantity);
       	  }
       })
       TotalSpending.update({},{$set : { productionTotal : totalProduction}});
       TotalSpending.update({},{$set : { total : total}});
    }
});

export default TotalSpending;

if(Meteor.isServer) {
	console.log('publishing spending')
	Meteor.publish('spending', function() {
		return TotalSpending.find();
	})
}

