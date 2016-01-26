
$(document).ready(function(){
	var propertySelect = $('#property');
	var properties =[];
	var identifier = propertySelect.val();
	var editVals=[];
	if(propertySelect[0]){
		for(var i= 0,b=propertySelect[0].options; i< b.length;i++){
		properties.push(b[i].value);
	}
		var identName= properties!==undefined? properties.shift(): {};
		function updateValues(){
			$( '#valueList' ).empty();
			$( '#value' ).val( '' );
		var propObj = {};
		propObj.idx=propertySelect[0].selectedIndex;
		$.post("/search/property/", propObj, function (data) {
			data = data.filter( function ( item, pos ){
				return data.indexOf( item ) == pos;
			} );

			for (var x = 0; x < data.length; x++) {
				$('#valueList').append('<option>' + data[x] + '</option>');
			}
		});
	}
		updateValues();
		propertySelect.on('change',	function(){ updateValues()});
	}
	$('input:checkbox').click(function (e){
		$(e.target).val(this.checked);
	});
	$('#addProperty').click(function(){
			//Collapses Row
			var collapseRow = function(containerNumber){
				$('#remove'+(containerNumber-1)).toggle();
				$("html, body").animate({ scrollTop: $(document).height() }, '0.15');
				$('#prop'+ containerNumber).collapse("toggle");

			};
			//Gives max children
			var childNumber = (function(){
				return (document.getElementById("objs").childNodes.length)+1;
			})();

			//Adds card body
			$('#objs').append(
			'<div class="collapse form-group col-xs-6 col-xs-offset-3" id="prop'+childNumber+'">'+
				'<label for="property'+childNumber+'Name" class="objname">Property Name</label>'+
					'<div class="row">'+
					  '<div class="schemEdit input-group  col-xs-12">'+
						 '<input id="property'+childNumber+'Name" type="text" name="property'+childNumber+'name" placeholder="Property Name" class="form-control"/>' +
						'<span class="input-group-btn"><button id="remove'+childNumber+'" class="remove btn btn-alert" type="button"><span class="remgly glyphicon glyphicon-remove-circle"></span></button></span>'+
					'</div>' +
				'</div>' +
			'</div>'
			);

			collapseRow(childNumber);
			$('input:checkbox').click(function (e){
				$(e.target).val(this.checked);
			});

			$('#remove'+childNumber).click(function(e){
				collapseRow(childNumber);
				$('#prop'+childNumber).on('hidden.bs.collapse',function(e){
					$(e.currentTarget).remove();
				});
			});


		});
	var addCardBody = function(identifier){
		return $(
		'<div class="col-md-4 card" id="cardn">' +
			'<div class="panel panel-default">' +
				'<div class="panel-heading">' +
					'<h3 class="cardHeader">' + identifier +'</h3>' +
				'</div>' +

			'<div class="panel-body" id="'+identifier+'">' +

			'</div>'+

			'<div class="panel-footer cardFooter">' +
				'<div class="row">' +
					'<a id="edit" class="col-xs-6 editEntity">Edit</a>' +
					'<a id="delete" class="col-xs-6 deleteEntity">Delete</a>' +
				'</div>' +
			'</div>' +

			'</div>'+
		'</div>' ).appendTo( '.cardTainer' );
	};
	function Attribute(cardId, pId, value){
		if(value!=="") {
			this.att = $( '<div class="blockquote col-md-6 component">' +
				'<a class="propVal" id="' + pId + '">' + decodeURI(value) + '</a>' +
				'<footer>' + decodeURI(properties[pId]) + '</footer>' +
				'</div>' ).appendTo( '#' + cardId );
			this.att.click( { propIdx : pId + 1, propVal : value }, function ( e ){
				searchAddCards( e.data );
			} );
		}
	}
	function Card(identifier, values){
		var that= this;
		this.card=addCardBody(identifier);
		this.identifier=identifier;
		this.properties= properties;
		this.values = values;
		this.attributes = [];
		for(var i = 0; i<properties.length; i++){
			this.attributes.push(new Attribute(this.identifier, i, this.values[i]));
		}
		$('#'+identifier ).parent().children( '.panel-footer' ).children( '.row' ).children( '.editEntity, .deleteEntity' ).click(function(e){
			editVals=[];
			editVals.push(that.identifier );
			editVals = editVals.concat(that.values);
			if( e.target.id === "edit"){
				that.edit();
			} else {
				$('#modSpanName' ).text(identifier);
				$('#deleteModal' ).modal();
			}
		});
	}
	Card.prototype.edit = function(){
		$('.edit' ).empty();
		$('#editHead' ).text(this.identifier);
		for(var i = 0; i<this.properties.length;i++){
			$('.edit' ).append(
				'<div class="col-md-6">' +
					'<label for="'+i+'" class="col-xs-12 propEdit">'+decodeURI(this.properties[i])+'</label>' +

						'<input name="in'+i+'" list="List' + i + '" id="' + i + '" class="entityInput input col-xs-12 " value="'+decodeURI(this.values[i])+'"/>' +
						'<datalist id="List' + i + '" class="entityList"></datalist>' +

				'</div>')
		}

		$('#editModal' ).modal();
		$( '.entityInput' ).focus( function ( e ){
			$.post( "/search/property/", { idx : parseInt(e.target.id)+1 }, function ( data ){
				data = data.filter( function ( item, pos ){
					return data.indexOf( item ) == pos;
				} );

				for( var x = 0; x < data.length; x++ ) {

					$( e.target ).siblings( ".entityList" ).append( '<option>' + data[x] + '</option>' );
				}
			} );

		} );
		$( '.entityInput' ).blur( function ( e ){
			$( e.target ).siblings( ".entityList" ).empty();
		} );
	};


	$('#searchButton').click(function(){
		var postData = {
				"propIdx": propertySelect[0].selectedIndex,
				"propVal": $('#value' ).val()
			};
		var cards = searchAddCards(postData)
	});
	$('#addEntity').click(function(e){
		e.preventDefault();
		$( '.entityInput' ).focus( function ( e ){
			$.post( "/search/property/", {idx:e.target.id}, function ( data ){
				data = data.filter( function ( item, pos ){
					return data.indexOf( item ) == pos;
				} );

				for( var x = 0; x < data.length; x++ ) {

					$( e.target ).siblings( ".entityList" ).append( '<option>' + decodeURI(data[x]) + '</option>' );
				}
			} );

		});
		$( '.entityInput' ).blur( function ( e ){
			$( e.target ).siblings( ".entityList" ).empty();
		} );

	});
	function searchAddCards(data){
		var cards = [];

		$.post( "/search/objects", data, function ( resdata ){
			$( '.cardTainer' ).empty();
			for( var i = 0; i < resdata.length; i++ ) {
				cards.push( new Card( resdata[i].shift(), resdata[i] ) );
			}
			return cards;
		} );
	}
	$('.editSub' ).click(function(e){
		e.preventDefault();
		$.post('/entities/edit', {prev: editVals, news:[editVals[0]].concat($('#editForm').serializeArray().map(function(e){return encodeURI( e.value );}))}, function(){
			$('#searchButton' ).click();
			$('#editModal' ).modal('hide');
		})
	});

	$('.delSub' ).click(function(e){
		e.preventDefault();
		$.post( '/entities/delete', {prev : editVals}, function (){
			$( '#searchButton' ).click();
			$( '#deleteModal' ).modal( 'hide' );
		} )
	});

	$('.addSub' ).click(function(e){
		var newObj= $( '#addForm' ).serializeArray().map( function ( e ){
			return encodeURI( e.value );
		});
		console.log(newObj);
		$.post('/search/objects',{propIdx:0, propVal:newObj[0]}, function(data){
			if(!(data['return'])){
				alert("An object with that "+identifier+" already exists");
				$('#ident' ).val('');
			} else {
				$.post('/entities/new', {vals: newObj}, function(response){
					$('#addModal' ).modal('hide');
					$( '#addForm' ).find( "input" ).val( "" );
					updateValues();
				});
			}
		})
	});

	$('#submitProperty' ).click(function(e){
		e.preventDefault();
		var props = $('#schemForm' ).serializeArray().map( function ( element, index, array ){
			return encodeURI(element.value);
		} );
		$.post('/schema', {data:props}, function(e){
			window.location.href = '/search';

		});
	})
});
