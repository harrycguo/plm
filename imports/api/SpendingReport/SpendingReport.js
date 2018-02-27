import { Mongo } from 'meteor/mongo';
import { ReportSchema } from '../Ingredients/Schemas.js';

Report = new Mongo.Collection('report');
Report.attachSchema(ReportSchema);

export default Report;

if(Meteor.isServer) {
	Meteor.publish('report', function() {
		return Report.find();
	});
}