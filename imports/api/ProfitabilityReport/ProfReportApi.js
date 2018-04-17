import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Intermediates } from '../Intermediates/intermediates.js'
import ProfReport from './ProfReport.js';
import ProductionReport from '../ProductionReport/ProductionReport.js'
import './ProfReportTotalApi.js'

if (Meteor.isClient) {
    Meteor.subscribe('profreport')
    Meteor.subscribe('prodreport')
}

Meteor.methods({
	'profreport.insert': function(id) {
		ProfReport.insert({id : id})
	},
	'profreport.updateAvgWholesalePrice': function(id, price, qty) {
		let repArr = ProfReport.find({ id : id}).fetch()
		if (repArr.length === 0) {
			Meteor.call('profreport.insert',id)
			repArr = ProfReport.find({ id : id}).fetch()
		}
		var rep = repArr[0]
		let totalUnits = rep.unitsSold + qty
		let numerator = price + rep.totalPrice

		let newAvg = numerator/totalUnits
		ProfReport.update({id : id}, {$set : {avgWholesalePrice : newAvg}})
		ProfReport.update({id : id},{$inc : {totalPrice : price}})
		ProfReport.update({id : id}, {$inc : {unitsSold : qty}})
		let prodRep = ProductionReport.find({formula:id}).fetch()[0]
		ProfReport.update({id : id},{$set : {totalCost : prodRep.totalSpent}})
		rep = ProfReport.find({ id : id }).fetch()[0]
		ProfReport.update({id : id},{$set : {wholesaleRevenue : rep.unitsSold * newAvg}})
		rep = ProfReport.find({ id : id }).fetch()[0]
		ProfReport.update({id : id},{$set : {totalProfit : rep.wholesaleRevenue - rep.totalCost}})
		rep = ProfReport.find({ id : id }).fetch()[0]
		ProfReport.update({id : id},{$set : {perUnitProfit : rep.totalProfit/rep.unitsSold}})
		rep = ProfReport.find({ id : id }).fetch()[0]
		ProfReport.update({id : id},{$set : {profitMargin : rep.wholesaleRevenue/rep.totalCost}})

		Meteor.call('profreporttotal.updateAvgWholesalePrice',id,price,qty)
	},
	'profreport.updateUnitsSold': function(id, qty) {
		console.log
		ProfReport.update({id : id}, {$inc : {unitsSold : qty}})
		Meteor.call('profreport.updateTotalCost',id)
	},
	'profreport.updateTotalCost': function(id) {
		let profRepArr = ProfReport.find({ id : id}).fetch()
		if (profRepArr.length === 0) {
			Meteor.call('profreport.insert',id)
		}
		let rep = ProductionReport.find({formula:id}).fetch()[0]
		console.log(rep)
		ProfReport.update({id : id},{$set : {totalCost : rep.totalSpent}})
		Meteor.call('profreporttotal.updateTotalCost',id)
		Meteor.call('profreport.updateWholesaleRevenue',id)
	},
	'profreport.updateWholesaleRevenue': function(id) {
		let rep = ProfReport.find({ id : id }).fetch()[0]
		let product = rep.unitsSold * rep.avgWholesalePrice
		console.log("Product: " + product)
		ProfReport.update({id : id},{$set : {wholesaleRevenue : product}})
		Meteor.call('profreport.updateTotalProfit',id)
	},
	'profreport.updateTotalProfit': function(id) {
		let rep = ProfReport.find({ id : id }).fetch()[0]
		ProfReport.update({id : id},{$set : {totalProfit : rep.wholesaleRevenue - rep.totalCost}})
		Meteor.call('profreport.updatePerUnitProfit',id)
	},
	'profreport.updatePerUnitProfit': function(id) {
		let rep = ProfReport.find({ id : id }).fetch()[0]
		ProfReport.update({id : id},{$set : {perUnitProfit : rep.totalProfit/rep.unitsSold}})
		Meteor.call('profreport.updateProfitMargin',id)
	},
	'profreport.updateProfitMargin': function(id) {
		let rep = ProfReport.find({ id : id }).fetch()[0]
		ProfReport.update({id : id},{$set : {profitMargin : rep.wholesaleRevenue/rep.totalCost}})
	}
});