 
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Report from '../../../api/SpendingReport/SpendingReport.js';
import { Row, Col } from 'react-bootstrap';

class ReportSumsComp extends Component {
	render() {
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

		return (
		<div className="container">
	        <Row>
	            <Col><b>Total Spending:</b>{total}</Col>
	            <Col><b>Total Production Spending:</b> {totalProduction}</Col>
	        </Row>
        </div>)
        
	}
}

export default withTracker(() => {
	Meteor.subscribe('report')
	return {
		report: Report.find({}).fetch()
	};
})(ReportSumsComp);
