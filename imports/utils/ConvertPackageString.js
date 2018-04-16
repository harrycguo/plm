import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
export const packageStringMap = new Map([
	['Sack', 50],
	['Pail', 50],
	['Drum', 50],
	['Supersack', 50],
	['Truckload', 50],
	['Railcar', 50],
]);

// export function convertPackageString(package) {
//   var packageAsNum;
//   switch (package) {
// 	  case 'Sack':
// 	  case 'Pail':
// 	  	packageAsNum = 50;
// 	  	break;
// 	  case 'Drum':
// 	    packageAsNum = 500;
// 	    break;
// 	  case 'Supersack':
// 	    packageAsNum = 2000;
// 	    break;
// 	  case 'Truckload':
// 	    packageAsNum = 500000;
// 	    break;
// 	  case 'Railcar':
// 	    packageAsNum = 280000;
// 	    break;
// 	  default:
// 	}
// 	return packageAsNum;
// }

