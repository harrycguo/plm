import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTable from 'react-table';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button , ButtonToolbar, ControlLabel, Glyphicon } from 'react-bootstrap';
import IngredientList from '../../../api/Ingredients/IngredientList.js';
import { Intermediates } from '../../../api/Intermediates/intermediates.js'
import LotsHistory from '../../../api/Lots/LotsHistory.js'
import Formulas from '../../../api/Formulas/formulas.js'
import Vendors from '../../../api/Vendors/vendors.js'
import { ProductionHistory } from '../../../api/Production/production.js'

class RecallChild extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	renderRows() {
		//var lots = this.props.item.original.item.queue
		//console.log("Child: render Rows: ")
		//console.log(lots)
		var items = new Array();
		console.log(this.props)
		this.props.item.productionHistory.forEach(function(item) {
			var name = 'asdf';
			console.log(item)
			if(item.intermediate) {
				// Intermediate
				name = Intermediates.findOne({_id: item.inventoryID}).name
			} else {
				// Final
				name = Formulas.findOne({_id: item.inventoryID}).name
			}
			items.push({
				type: item.intermediate ? "Intermediate" : "Final",
				name: name,
				lot: item.lot,
				qty: item.qty,
				date: item.time.toLocaleDateString(),
				time: item.time.toLocaleTimeString(),
				item: item,
			})
		})
		return items;
	}

	renderChild(){
		return (
		<div>
			<ReactTable 
				data={this.renderRows()}
				defaultPageSize={this.props.item.productionHistory.length}
			    columns={[
			    	{
              			Header: "Expand",
              			columns: [
                			{
		                  expander: row => { return false },
		                  Header: () => <strong>More</strong>,
		                  width: 65,
		                  Expander: ({ isExpanded, ...rest }) =>
		                    <div>
		                      {isExpanded
		                        ? <span>&#x2299;</span>
		                        : <span>&#x2295;</span>}
		                    </div>,
		                  style: {
		                    cursor: "pointer",
		                    fontSize: 25,
		                    padding: "0",
		                    textAlign: "center",
		                    userSelect: "none"
		                  },
		                  Footer: () => <span>&hearts;</span>
		                }
		              ]
            		},
					{
						Header: 'Type',
						accessor: 'type',
					}, 
					{
						Header: 'Name',
						accessor: 'name',
					}, 
					{
						Header: 'Lot Number',
						accessor: 'lot',
					},
					{
						Header: "Stock Quantity",
						accessor: 'qty',
					},
					{
						Header: 'Date Produced',
						accessor: 'date',
					},
					{
						Header: 'Time Produced',
						accessor: 'time',
					},

				]}
				SubComponent={row=>{
					console.log(row)
					var toRecurse = undefined
					if(row.original.type != "Final") {
						this.props.lotshistory.forEach(function(lot) {
							if(row.original.type == "Intermediate" && lot.inventoryID == row.original.item.inventoryID) {
								console.log("match")
								toRecurse = lot
							}
						})
					}
					if(toRecurse != undefined) {
						// return (<RecallChild item={toRecurse}/>)
						return toRecurse.queue.map(lot => (
							<details key={lot.lot}>
								<summary>
								Lot number {lot.lot}
								</summary>
								<RecallChild item={lot}/>
							</details>
						));
					} else {
						return null
					}

				}}
	      	/>
		</div>) 

	}

	render() {
		console.log("CHILD")
		console.log(this.props)
		return (
			<>
			{this.renderChild()}
			</>
		)
	}
}

export default withTracker(() => {
	Meteor.subscribe('recallreport')
	Meteor.subscribe('ingredients')
	Meteor.subscribe('intermediates')
	Meteor.subscribe('formulas')
	Meteor.subscribe('lotshistory')
	Meteor.subscribe('productionHistory')
	// Meteor.subscribe('vendors')
	return {
		ingredients: IngredientList.find({}).fetch(),
		intermediates: Intermediates.find({}).fetch(),
		formulas: Formulas.find({}).fetch(),
		lotshistory: LotsHistory.find({}).fetch(),
		productionHistory: ProductionHistory.find({}).fetch(),
		// vendors: Vendors.find({}).fetch(),
	};
})(RecallChild);