import { Mongo } from 'meteor/mongo';
import { ProdReportSchema, IngredientProdInfoSchema } from '../Ingredients/Schemas.js';

ProductionReport = new Mongo.Collection('prodReport');
ProductionReport.attachSchema(ProdReportSchema);

export default ProductionReport;

if(Meteor.isServer) {
	Meteor.publish('prodReport', function() {
		return ProductionReport.find();
	});
}