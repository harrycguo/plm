import { Mongo } from 'meteor/mongo';

export default function convertPackageString(package) {
  var packageAsNum;
  switch (package) {
	  case 'Sack':
	  case 'Pail':
	  	packageAsNum = 50;
	  	break;
	  case 'Drum':
	    packageAsNum = 500;
	    break;
	  case 'Supersack':
	    packageAsNum = 2000;
	    break;
	  case 'Truckload':
	    packageAsNum = 500000;
	    break;
	  case 'Railcar':
	    packageAsNum = 280000;
	    break;
	  default:
	    console.log('no conversion found');
	}
	return packageAsNum;
}