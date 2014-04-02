$(document).ready( function(){

	SVG = $('svg');
	gCtxMenu = $('#gContextMenu');
	off_top = SVG.offset().top;
	off_left = SVG.offset().left;
	x = 0;
	y = 0;
	count = 0;
	selected = null;
	openState = null;

	$(document).on('contextmenu', SVG, function(e){
		// alert('Context Menu event has fired!');
		return false;
	});

	SVG.on('mousedown', 'g', function(e){
		selected = $(this);
		if (e.which == 3) {
			showContextMenu(e);
		} else {
			hideContextMenu();
		}
	});

	function showContextMenu(e) {
		gCtxMenu.css("top", e.pageY);
		gCtxMenu.css("left", e.pageX);
		gCtxMenu.show();
	}

	function hideContextMenu(){
		gCtxMenu.hide();
	}

	function contextMenuHidden() {
		return gCtxMenu.is(":hidden");
	}

	SVG.on('mouseup', 'g',  function(e){
		if (selected != null && e.which != 3) {			
			x = e.pageX - off_left;
			y = e.pageY - off_top;

			if (openState == null) {
				openState = $(this);
				openState.prepend(
					$(document.createElementNS('http://www.w3.org/2000/svg', 'line')).attr(
						{'x1': x, 'y1': y, 'stroke': 'red', 'stroke-width': 2})
				);
			} else {
				openState.find('line').attr({'x2': x, 'y2': y});
				openState = null;
			}
		}
	});

	SVG.on('mousemove', SVG, function(e){
		if (selected != null && e.which != 3 && contextMenuHidden()) {
			x = e.pageX - off_left;
			y = e.pageY - off_top;
			selected.find('text').attr({
				'x': x - selected.find('text').width()/2,
				'y': y - selected.find('text').height()*2
			});
			selected.find('circle').attr({'cx': x, 'cy': y});
		}
	});

	SVG.on('mouseup', function(e){
		if (selected != null && e.which != 3) {
			x = e.pageX - off_left;
			y = e.pageY - off_top;
			selected.find('text').attr({
				'x': x - selected.find('text').width()/2,
				'y': y - selected.find('text').height() + 50
			});
			selected.find('circle').attr({'cx': x, 'cy': y});
		}
		selected = null;
	});

	SVG.on('mousedown', function(e){		
		if (selected == null) {
			if (e.which != 3) {
				hideContextMenu();
			} else {
				return;
			}
			x = e.pageX - off_left;
			y = e.pageY - off_top;

			SVG.append($(document.createElementNS('http://www.w3.org/2000/svg', 'g')).attr({'id': 'q'+count, 'x': x, 'y': y}));

			$('#q'+count).append(
				$(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).attr(
					{'cx': x, 'cy': y, 'r': 30, 'stroke': 'black', 'stroke-width': 1, 'fill': 'white'})
			).append(
				$(document.createElementNS('http://www.w3.org/2000/svg', 'text')).attr(
					{'x': x, 'y': y, 'stroke': 'black', 'fill': 'black'}).html('Q'+count)
			);

			SVG.append(function(){
				$(document.createElementNS('http://www.w3.org/2000/svg', 'animate')).attr(
					{'attributeName': 'r', 'from': 0, 'to': 30, 'dur': '3s'});
				$(document.createElementNS('http://www.w3.org/2000/svg', 'animate')).attr(
					{'attributeName': 'stroke-width', 'from': 0, 'to': 10, 'dur': '3s'});
			});

			textWidth = $('#q'+count+' text').width()/2;
			textHeight = $('#q'+count+' text').height()/4;
			$('#q'+count+' text').attr({'x': x - textWidth, 'y': y + textHeight});
			count++;
		} else {
			if (e.which != 3) {
				hideContextMenu();
			} else {
				return;
			}
		}
	});

	SVG.on('mousemove', SVG, function(e){
		if (openState != null  && e.which != 3) {
			openState.find('line').attr({'x2': e.pageX - off_left, 'y2': e.pageY - off_top});
		}
	});

});