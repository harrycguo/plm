//Total spending
import { Mongo } from 'meteor/mongo';
import { Vendors } from '../Vendors/vendors.js';
import { SpendingSchema } from '../Ingredients/Schemas.js';
import Report from './SpendingReport.js';

if (Meteor.isClient) {
	Meteor.subscribe('report');
}
console.log("Creating spending collection");
TotalSpending = new Mongo.Collection('spending');

//Attach a schema to the collection for automatic validation on insert/update operations
TotalSpending.attachSchema(SpendingSchema);

var cursor = Report.find();
if (TotalSpending.find().fetch().length === 0) {
      console.log("inserting single element")
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
      } else {
            total += (rep.price * rep.quantity);
      }
})
TotalSpending.update({},{$set : { productionTotal : totalProduction}});
TotalSpending.update({},{$set : { total : total}});
// const handle = cursor.observeChanges({
//     'added': function(id, report) {
//       console.log("Report changed")
//        // This code runs when a new object "object" was added to collection.
       

       
//     }
// });

export default TotalSpending;

if(Meteor.isServer) {
	console.log('publishing spending')
	Meteor.publish('spending', function() {
		return TotalSpending.find();
	})
}

