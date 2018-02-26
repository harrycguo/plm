import { Mongo } from 'meteor/mongo';
import { ProdReportSchema, IngredientProdInfoSchema } from '../Ingredients/Schemas.js';

ProductionReport = new Mongo.Collection('prodReport');
ProductionReport.attachSchema(ProdReportSchema);

export default ProductionReport;

if(Meteor.isServer) {
	console.log('publishing production report');
	Meteor.publish('prodReport', function() {
		return Report.find();
	});
}