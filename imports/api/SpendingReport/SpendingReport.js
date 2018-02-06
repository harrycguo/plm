import { Mongo } from 'meteor/mongo';
import { ReportSchema } from '../Ingredients/Schemas.js';
//Cart Database

Report = new Mongo.Collection('report');
Report.attachSchema(ReportSchema);

export default Report;

if(Meteor.isServer) {
	console.log('publishing report');
	Meteor.publish('report', function() {
		return Report.find();
	});
}