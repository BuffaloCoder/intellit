"use strict";
let onResize = function(){
  var curPos = $('.mainImage').position();
  if(curPos){
  	var curHeight = $('.mainImage').height();
  	var curWidth = $('.mainImage').width();
  	var ratio = curHeight/curWidth;
  	var maxWidth = $(window).width()-curPos.left;
  	var maxHeight = $(window).height()-curPos.top;
  	var width = maxHeight > ratio*maxWidth ? maxWidth : maxHeight*(1/ratio);
  	var height = maxHeight > ratio*maxWidth ? maxWidth*(ratio) : maxHeight;

	  $('.mainImage').height(height);
	  $('.mainImage').width(width);
	}

  return Session.get('resize');}

Template.drawingSurface.helpers({
 resized : onResize
}); 
Session.set('position', '');
Template.drawingSurface.events({
	'click .box' : function(evt){
		console.log('clickedBox');
	},
	'mousedown .box' : function(evt){
		console.log('clickedBox');
		return false;
	},
	'mouseup .box' : function(evt){
		console.log('clickedBox');
	},
	'click .toDraw' : function(evt){
	},
	'mousedown .toDraw' : function(evt){
		console.log('caught click');
		Session.set('held', true);
		Session.set('position', {top: evt.pageY, left: evt.pageX});
	},
	'mouseup .toDraw' : function(evt){
		console.log('caught click');
		Session.set('held', false);
		Session.set('box', null);
	}
})

Template.drawingSurface.rendered = function(){
	Session.set('held', false);
	$('.toDraw').on('mousemove', function(event){
		if(Session.get('held')){
			console.log('dragging');
			var box = Session.get('box');
			var position = Session.get('position');
			if(!box){
				box = Date.now();
				var boxHtml = $('<div id="'+box+'" class="box"></div>');
				console.log('create box')
				$('.toDraw').append(boxHtml);
				$('#'+box).offset(position);
				Session.set('box', box);
			}
			$('#'+box).width(Math.abs(position.left - event.pageX));
			$('#'+box).height(Math.abs(position.top - event.pageY));

		}
	});
	onResize();
}