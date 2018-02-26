import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Report from '../../../api/SpendingReport/SpendingReport.js';
import ReportSumsComp from '../../components/SpendingReport/ReportSumsComp.js';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import InventoryManagementNavBar from '../../components/InventoryManagementNavBar/InventoryManagementNavBar.js'



// <<<<<<< HEAD
// 	renderTransactionItems() {
// 		var frontEndReport = Array()
// 		var keyCount = 0;
// 		this.props.carts.forEach(function(ingredients) {
// 			ingredients.ingredients.forEach(function(ing) {
// 				frontEndCart.push(
// 					{key: keyCount, fullIng: ing, amt: ing.amount}
// 				)
// 				keyCount++;
// 				console.log(ing)
// 			})
// 		});
// 		return frontEndReport.map(ingredient => (
// 			<tr key={ingredient.key}>
// 				<td>{ingredient.fullIng.ingredient.name}</td>
// 				<td>{ingredient.amt}</td>
// 				<td>
// 					<button
// 					onClick={this.remove.bind(ingredient)}
// 					title= "Edit">
// 						Remove From Cart
// 					</button>
// 				</td>
// 			</tr>
// 		))
// =======
class SpendingReport extends Component {
	convertFromTimestamp(time) {
		// Method courtesy of StackOverflow user Aelios (https://stackoverflow.com/questions/12409299/how-to-get-current-formatted-date-dd-mm-yyyy-in-javascript-and-append-it-to-an-i)
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){
		    dd='0'+dd;
		} 
		if(mm<10){
		    mm='0'+mm;
		} 
		var today = dd+'/'+mm+'/'+yyyy;
		return today;
// >>>>>>> 050004ae2355448de59ced748bf72559b6015b2b
	}

	linkBack() {
		if (!Meteor.user() || !Roles.userIsInRole(Meteor.user()._id, 'admin')) {
			return (<li><Link to='/inventoryManagement'>Return to Inventory</Link></li>)
		} else {
			return (<li><Link to='/inventoryManagement'>Return to Inventory</Link></li>)
		}
	}

	headerValues() {
		return [
			{
				Header: 'Ingredient',
				accessor: 'ing',
			}, 
			{
				Header: 'Amount (lbs)',
				accessor: 'amt',
			}, 
			{
				Header: 'Cost Per Pound',
				accessor: 'cost',
			},
			{
				Header: 'Order Type',
				accessor: 'type',
			}, 
			{
				Header: 'Date',
				accessor: 'date',
			}
		];
	}

	renderRows(_this) {
		var reportRows = new Array()
		this.props.report.forEach(function(ing) {
			reportRows.push({
				ing: ing.ingredient_name,
				amt: ing.quantity,
				cost: ing.price,
				type: ing.type,
				date: _this.convertFromTimestamp(ing.createdAt)
			})
		});
		return reportRows;
	}

	render() {
		return (
			<div className="container" >
			<header>
          		<h1>Spending Report</h1>
        	</header>
			<InventoryManagementNavBar/>
			<ReportSumsComp />
	       		<ReactTable
		    		data={this.renderRows(this)}
		    		filterable
		    		defaultFilterMethod={ (filter, row) => 
		    			String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
					}
		    		columns={this.headerValues()}
		  		/>
			</div>
		)
	}

}

export default withTracker(() => {
	Meteor.subscribe('report')
	return {
		report: Report.find({}).fetch()
	};
})(SpendingReport);
