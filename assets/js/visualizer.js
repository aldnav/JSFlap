$(document).ready( function(){

	SVG = $('svg');
	off_top = SVG.offset().top;
	off_left = SVG.offset().left;
	x = 0;
	y = 0;
	count = 0;
	selected = null;
	openState = null;

	$(document).on('contextmenu', 'circle', function(e){
		e.preventDefault();
	   alert('Context Menu event has fired!');
	   return false;
	});

	SVG.on('mousedown', 'g', function(e){
		selected = $(this);
		console.log(e.which);
	});

	SVG.on('mouseup', 'g',  function(e){
		if (selected != null) {
			if (openState != null) {

			}
			openState = $(this);
			$('line').attr({'x1': e.pageX - off_left, 'y1': e.pageY - off_top});
		}
	});

	SVG.on('mousemove', SVG, function(e){
		if (selected != null) {
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
		if (selected != null) {
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

			textWidth = $('#q'+count+' text').width()/2;
			textHeight = $('#q'+count+' text').height()/4;
			$('#q'+count+' text').attr({'x': x - textWidth, 'y': y + textHeight});
			count++;	
		}
	});

	SVG.on('mousemove', SVG, function(e){
		$('line').attr({'x2': e.pageX - off_left, 'y2': e.pageY - off_top});
	});
});