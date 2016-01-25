var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var accountModel = require('../models/account');


/* GET home page. */

router.post('/new', function(req,res,next){
	accountModel.findOneAndUpdate(
		{ username : req._passport.session.user },
		{
			$push : {
				"objects" : req.body['vals[]']
			}
		},
		{ safe : true, upsert : true, new : true },
		function ( err ){
			if( err )console.log( err );
			//validation
			res.json("done");
		}
	);
});

router.post('/delete',function(req,res,next){
	var old  = new mongoose.Types.Array( req.body['prev[]'] );
	accountModel.findOneAndUpdate(
		{ username : req._passport.session.user },
		{
			$pull : { objects : old }
		},
		function ( err ){
			if( err ) console.log( err );
			res.json( "done" )
		} );


});

router.post('/edit', function(req, res, next){
	var old = new mongoose.Types.Array( req.body['prev[]']);
	var news = new mongoose.Types.Array(req.body['news[]']);
	accountModel.findOneAndUpdate(
		{username:req._passport.session.user },
		{
			$pull : {objects:old}
		},
		function(err){
			if(err) console.log(err);
			accountModel.findOneAndUpdate(
				{ username : req._passport.session.user	 },
				{
					$push : { objects : news }
				},
				function ( err ){
					if( err ) console.log( err );
					res.json( "	done" )
				} );
		});
});

var findData =function(){
};
module.exports = router;


