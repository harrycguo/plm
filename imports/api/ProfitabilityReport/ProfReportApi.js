import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Intermediates } from '../Intermediates/intermediates.js'
import ProfReport from './ProfReport.js';
import ProductionReport from '../ProductionReport/ProductionReport.js'


if (Meteor.isClient) {
    Meteor.subscribe('profreport')
    Meteor.subscribe('prodreport')
}

Meteor.methods({
	'profreport.insert': function(id) {
		ProfReport.insert({id : id})
	},
	'profreport.updateAvgWholesalePrice': function(id, price, quantity) {
		let rep = ProfReport.find({ id : id}).fetch()[0]
		let history = rep.saleHistory
		let totalUnits = rep.unitsSold + quantity
		let numerator = price + rep.totalPrice

		let newAvg = numerator/totalUnits
		ProfReport.update({id : id}, {$set : {avgWholesalePrice : newAvg}})
		ProfReport.update({id : id},{$inc : {totalPrice : price}})
		Meteor.call('profreport.updateUnitsSold',id,quantity)
		Meteor.call('profreport.updateTotalCost',id)
	},
	'profreport.updateUnitsSold': function(id, qty) {
		ProfReport.update({id : id}, {$inc : {unitsSold : qty}})
	},
	'profreport.updateTotalCost': function(id) {
		let rep = ProductionReport.find({formula:id}).fetch()[0]
		console.log(rep)
		ProfReport.update({id : id},{$set : {totalCost : rep.totalSpent}})
	}
});