var express      = require( 'express' );
var mongoose     = require( 'mongoose' );
var accountModel = require( '../models/account' );
var router       = express.Router();


/* GET home page. */
router.get( '/', function ( req, res, next ){
	accountModel.aggregate( [{ $match : { username : req._passport.session.user } },
			{ $project : { properties : "$properties", identifier : "$identifier", objName:"$objName"  } }],
		function ( err, data ){
			if( err ) console.log( err );
			if(data) {
				res.render( "search", {
					properties : data[0].properties,
					identifier : data[0].identifier,
					objName :    data[0].objName
				} );
			} else{
				res.redirect('../');
			}
		} )
} );

router.post( '/property', function ( req, res, next ){
	//This will get all values of a property
	console.log(req.body.idx);
	accountModel.aggregate(
		[{ $match : { username : req._passport.session.user } },
			{
				$project : {
					vals : {
						$map : {
							input : "$objects",
							as :    "entity",
							in :    { $arrayElemAt : ["$$entity", parseInt(req.body.idx)] }
						}
					}
				}
			}],

		function ( err, data ){
			if(data){
			res.json(data[0].vals);
			} else{
				res.redirect('../')
			}
		}
	);
} );

router.get('/get',function(req, res, next){
	accountModel.aggregate( [{ $match : { username : req._passport.session.user } },
			{ $project : { properties : "$properties", identifier : "$identifier" } }],
		function ( err, data ){
			if( err ) console.log( err );
			if(data) {
				res.json( { properties : data[0].properties, identifier : data[0].identifier } );
			} else {
				res.redirect('../')
			}
		})

});
//GIVES ALL MATCHING OBJECTS
router.post( '/objects', function ( req, res, next ){
	if(req.body.propVal === ""){
		accountModel.aggregate( [
			{
				$match : { username : "walkersinil" }
			},
			{
				$project : {
					vals : "$objects"
				}
			}

		], function ( err, data ){
			sendCheck( err, data )
		} );
	} else {
		accountModel.aggregate( [
			{
				$match : { username : "walkersinil" }
			},
			{
				$project : {
					vals : {
						$filter : {
							input : "$objects",
							as :    "entity",
							cond :  { $eq : [{ $arrayElemAt : ["$$entity", parseInt( req.body.propIdx )] }, req.body.propVal] }
						}
					}
				}
			}

		], function(err, data){sendCheck(err, data)});
	}
	var sendCheck = function ( err, data ){
		if( err ) console.log( err );
		if( data[0].vals[0] ) {
			res.json( data[0].vals );
		}
		else {
			res.json( { "return" : "none" } );

		}
	}

} );
module.exports = router;
