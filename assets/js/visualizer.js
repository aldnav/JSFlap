$(document).ready( function(){

	$stage = $('svg');
	$off_top = $stage.offset().top;
	$off_left = $stage.offset().left;
	$x = 0;
	$y = 0;
	$count = 0;
	$flag = false;
	$selected = null;

	$stage.on('contextmenu', 'circle', function(e){
	   alert('Context Menu event has fired!');
	   return false;
	});

	$stage.on('mousedown', 'circle', function(e){
		$flag = true;
		$selected = $(this);
	});

	$stage.on('mousemove', $stage, function(e){
		if ($selected != null)
			$selected.attr({'cx': e.pageX - $off_left, 'cy': e.pageY - $off_top});
	});

	$(document).mouseup(function(e){
		$flag = false;
		if ($selected != null)
			$selected.attr({'cx': e.pageX - $off_left, 'cy': e.pageY - $off_top});
		$selected = null;
	});

	$stage.on('mousedown', function(e){
		if ($selected == null) {
			$x = e.pageX - $off_left;
			$y = e.pageY - $off_top;

			$stage.append(
				$(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).attr(
					{'id': 'q'+$count, 'cx': $x, 'cy': $y, 'r': 30, 'stroke': 'black', 'stroke-width': 1, 'fill': 'white'})
			);
			$count++;	
		}
	});

});