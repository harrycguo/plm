import { Mongo } from 'meteor/mongo';

function convertPackageString(package) {
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

function dhm(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? '0' + n : n; };
  if( m === 60 ){
    h++;
    m = 0;
  }
  if( h === 24 ){
    d++;
    h = 0;
  }
  return [d, pad(h), pad(m)].join(':');
}

export { convertPackageString, dhm}