var express      = require( 'express' );
var mongoose     = require( 'mongoose' );
var accountModel = require( '../models/account' );
var router       = express.Router();

/* GET home page. */
router.get( '/', function ( req, res, next ) {
	if(req._passport.session.user) res.render( 'schema' );
	else{
		res.redirect("../")
	}
} );

//gets object info, and property info, splits them, and updates mongodb
router.post( '/', function ( req, res, next ) {
	//Splits req and shared from body

	var info = req.body['data[]'],
		props  = [],
		shared = [],
		name = info.shift(),
		identifier= info.shift();


	accountModel.findOneAndUpdate(
		{ username : req._passport.session.user },
				{$set : {
						"properties" : info,
						"objName" :    name,
						"identifier" : identifier
					}
				},
				{safe : true, upsert : true, new : true},
				function ( err ){
					if( err )console.log( err );
					res.redirect( '/search' );
				}
	);
});

module.exports = router;
