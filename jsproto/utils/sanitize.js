#!/usr/bin/env node

let objectToSanitize = {"results":[{"address_components":[{"long_name":"277","short_name":"277","types":["street_number"]},{"long_name":"Bedford Avenue","short_name":"Bedford Ave","types":["route"]},{"long_name":"Williamsburg","short_name":"Williamsburg","types":["neighborhood","political"]},{"long_name":"Brooklyn","short_name":"Brooklyn","types":["sublocality","political"]},{"long_name":"Kings","short_name":"Kings","types":["administrative_area_level_2","political"]},{"long_name":"New York","short_name":"NY","types":["administrative_area_level_1","political"]},{"long_name":"United States","short_name":"US","types":["country","political"]},{"long_name":"11211","short_name":"11211","types":["postal_code"]}],"formatted_address":"277 Bedford Avenue, Brooklyn, NY 11211, USA","geometry":{"location":{"lat":40.714232,"lng":-73.9612889},"location_type":"ROOFTOP","viewport":{"northeast":{"lat":40.7155809802915,"lng":-73.9599399197085},"southwest":{"lat":40.7128830197085,"lng":-73.96263788029151}}},"place_id":"ChIJd8BlQ2BZwokRAFUEcm_qrcA","types":["street_address"]}],"status":"OK"};

//console.dir( objectToSanitize, { showHidden: false, depth: null, colors: true } );

class ObjectUtils {
	static doForAll( object, targetType, callback ) {
		let type = typeof object;

		if( type === targetType ) {
			object = callback( object );
		} else if( type === "object" ) {
			let keys = Object.keys( object );
			for( let key of keys ) {
				object[ key ] = ObjectUtils.doForAll( object[ key ], targetType, callback );
			}
		} else {
			console.warn( " === >  Excluded type: " + type );
		}

		return object;
	}

	static doForAllStrings(  object, callback ) {
		return ObjectUtils.doForAll(  object, "string", callback );
	}
}

//let testCallBack = ( string ) => {
//	//console.log( string );
//	string = "HIT: " + string;
//	return string;
//};
//
//let testNumberCallBack = ( num ) => {
//	return Math.round( num );
//};

//objectToSanitize = ObjectUtils.doForAll( objectToSanitize, "string", testCallBack );
//objectToSanitize = ObjectUtils.doForAll( objectToSanitize, "number", testNumberCallBack );
//let resultObj = ObjectUtils.doForAllStrings( objectToSanitize, testCallBack );

//console.dir( objectToSanitize, { showHidden: false, depth: null, colors: true } );
//console.dir( resultObj, { showHidden: false, depth: null, colors: true } );

//let testvar = "Pippo";
//console.dir(
//	ObjectUtils.doForAllStrings( testvar, testCallBack ),
//	{ showHidden: false, depth: null, colors: true }
//);
//console.dir( testvar, { showHidden: false, depth: null, colors: true } );