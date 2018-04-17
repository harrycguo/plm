import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Intermediates } from '../Intermediates/intermediates.js'
import ProfReportTotal from './ProfReportTotal.js';
import ProductionReport from '../ProductionReport/ProductionReport.js'

if (Meteor.isClient) {
    Meteor.subscribe('profreport')
    Meteor.subscribe('prodreport')
    Meteor.subscribe('profreporttotal')
}

Meteor.methods({
	'profreporttotal.insert': function() {
		ProfReportTotal.insert({totalCostArr: []})
	},
	'profreporttotal.updateAvgWholesalePrice': function(id, price, qty) {
		let repArr = ProfReportTotal.find({}).fetch()
		if (repArr.length === 0) {
			Meteor.call('profreporttotal.insert')
			repArr = ProfReportTotal.find({}).fetch()
		}
		let rep = repArr[0]
		let totalUnits = rep.unitsSold + qty
		let numerator = price + rep.totalPrice

		let newAvg = numerator/totalUnits
		ProfReportTotal.update({}, {$set : {avgWholesalePrice : newAvg}})
		ProfReportTotal.update({},{$inc : {totalPrice : price}})
		ProfReportTotal.update({}, {$inc : {unitsSold : qty}})
		rep = ProfReportTotal.find({}).fetch()[0]
		let profRepArr = ProfReportTotal.find({}).fetch()
		if (profRepArr.length === 0) {
			Meteor.call('profreporttotal.insert',id)
			profRepArr = ProfReportTotal.find({}).fetch()
		}
		let profRep = profRepArr[0]
		let prodRep = ProductionReport.find({formula:id}).fetch()[0]

		var found = false 
		profRep.totalCostArr.forEach(function(element) {
			if (element.id == id) {
				found = true
			}
		})

		sum = 0
		if (found) {
			profRep.totalCostArr.forEach(function(element) {
				sum += ProductionReport.find({formula:element.id}).fetch()[0].totalSpent
			})
			ProfReportTotal.update({},{$set : {totalCost : sum}})
		}
		else {
			ProfReportTotal.update({},{$push : {totalCostArr : {id : id}}})
			ProfReportTotal.update({},{$inc : {totalCost : prodRep.totalSpent}})
		}
		rep = ProfReportTotal.find({}).fetch()[0]
		ProfReportTotal.update({},{$set : {wholesaleRevenue : rep.unitsSold * rep.avgWholesalePrice}})
		rep = ProfReportTotal.find({}).fetch()[0]
		ProfReportTotal.update({},{$set : {totalProfit : rep.wholesaleRevenue - rep.totalCost}})
		// Meteor.call('profreporttotal.updateUnitsSold',id,quantity)
	},
	'profreporttotal.updateUnitsSold': function(id, qty) {
		ProfReportTotal.update({}, {$inc : {unitsSold : qty}})
		Meteor.call('profreporttotal.updateTotalCost',id)
	},
	'profreporttotal.updateTotalCost': function(id) {
		let profRepArr = ProfReportTotal.find({}).fetch()
		if (profRepArr.length === 0) {
			Meteor.call('profreporttotal.insert',id)
			profRepArr = ProfReportTotal.find({}).fetch()
		}
		let profRep = profRepArr[0]
		let rep = ProductionReport.find({formula:id}).fetch()[0]
		console.log(rep)

		var found = false 
		profRep.totalCostArr.forEach(function(element) {
			if (element.id == id) {
				found = true
			}
		})

		sum = 0
		if (found) {
			profRep.totalCostArr.forEach(function(element) {
				sum += ProductionReport.find({formula:element.id}).fetch()[0].totalSpent
			})
			ProfReportTotal.update({},{$set : {totalCost : sum}})
		}
		else {
			ProfReportTotal.update({},{$push : {totalCostArr : {id : id}}})
			ProfReportTotal.update({},{$inc : {totalCost : rep.totalSpent}})
		}
		Meteor.call('profreporttotal.updateWholesaleRevenue')
	},
	'profreporttotal.updateWholesaleRevenue': function() {
		let rep = ProfReportTotal.find({}).fetch()[0]
		ProfReportTotal.update({},{$set : {wholesaleRevenue : rep.unitsSold * rep.avgWholesalePrice}})
		Meteor.call('profreporttotal.updateTotalProfit')
	},
	'profreporttotal.updateTotalProfit': function() {
		let rep = ProfReportTotal.find({}).fetch()[0]
		ProfReportTotal.update({},{$set : {totalProfit : rep.wholesaleRevenue - rep.totalCost}})
	}
});