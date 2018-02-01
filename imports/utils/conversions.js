import { Mongo } from 'meteor/mongo';

export default function convertPackageString(package) {
  var packageAsNum;
  switch (package.toLowerCase()) {
	  case 'sack':
	  case 'pail':
	  	packageAsNum = 50;
	  	break;
	  case 'drum':
	    packageAsNum = 500;
	    break;
	  case 'supersack':
	    packageAsNum = 2000;
	    break;
	  case 'truckload':
	    packageAsNum = 50000;
	    break;
	  case 'railcar':
	    packageAsNum = 280000;
	    break;
	  default:
	    console.log('no conversion found');
	}
	return packageAsNum;
}