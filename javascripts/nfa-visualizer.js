function NFAVisualizer() {}
NFAVisualizer.visualize = function(selector, nfa) {
  var container = document.querySelector(selector);
  var width = getComputedStyle(container)['width'];
  var height = getComputedStyle(container)['height'];
  var svg = SVG.create('svg', { width: width, height: height });
  var transitionsGroup = SVG.create('g', { class: 'transitions' });
  var statesGroup = SVG.create('g', { class: 'states' });
  var arrowHeadsGroup = SVG.create('g', { class: 'arrow-heads' });
  var labelsGroup = document.createElement('div');
  labelsGroup.setAttribute('class', 'labels');
  labelsGroup.setAttribute('for', selector);
  container.appendChild(svg);
  document.body.appendChild(labelsGroup);
  labelsGroup.style.top = container.offsetTop + 'px';
  labelsGroup.style.left = container.offsetLeft + 'px';
  labelsGroup.style.width = width;
  labelsGroup.style.height = height;
  svg.appendChild(transitionsGroup);
  svg.appendChild(statesGroup);
  svg.appendChild(arrowHeadsGroup);
  width = svg.width.baseVal.value;
  height = svg.height.baseVal.value;

  var states = {};
  var interval = width / (nfa.stateCount + 1);
  var i = 1;
  for (var label in nfa.states) {
    var state = SVG.create('circle', { cx: interval * i++, cy: height / 2, r: 12, label: label });
    states[label] = state;
    statesGroup.appendChild(state);
    var label = NFAVisualizer.getStateLabel(state);
    labelsGroup.appendChild(label);
  }

  for (var label in nfa.states) {
    var source = states[label];
    var state = nfa.states[label];
    for (var symbol in state.transitions) {
      for (var i = 0; i < state.transitions[symbol].length; i++) {
        var sl = state.label;
        var dl = state.transitions[symbol][i].label;
        var destination = states[dl];
        var s = NFAVisualizer.getStateCoordinates(source);
        var d = NFAVisualizer.getStateCoordinates(destination);
        var distance = Math.distance(s, d);

        var f = 3;
        var n = s.x < d.x ? 'r' : 'l';
        var c = NFAVisualizer.getCurveControlPoints(distance, f, n);

        if (document.querySelector('path[source="' + sl + '"][destination="' + dl + '"]')
          || document.querySelector('path[source="' + dl + '"][destination="' + sl + '"]')
          || distance > interval * 1.5) {
          while (document.querySelector('path[d="' + NFAVisualizer.generatePathDefinition(s, c, d) + '"]') && f > 0) {
            c = NFAVisualizer.getCurveControlPoints(distance, f = f - 2, n);
          }
          var transition = SVG.create('path', { d: NFAVisualizer.generatePathDefinition(s, c, d), source: sl, destination: dl, symbol: symbol });
          var label = NFAVisualizer.getTransitionLabel(s, c, symbol);
          transitionsGroup.appendChild(transition);
          labelsGroup.appendChild(label);
        } else {
          var transition = SVG.create('path', { d: 'M' + s.x + ',' + s.y + ' L' + d.x + ',' + d.y, source: sl, destination: dl, symbol: symbol });
          var label = NFAVisualizer.getTransitionLabel(s, { x1: 0, y1: 0, x2: distance, y2: 0 }, symbol);
          var angle = Math.angle(d, s);
          var origin = Math.coordinates(d, 12, angle);
          var arrowHead = NFAVisualizer.getArrowHead(origin, angle);
          transitionsGroup.appendChild(transition);
          labelsGroup.appendChild(label);
          arrowHeadsGroup.appendChild(arrowHead.left);
          arrowHeadsGroup.appendChild(arrowHead.right);
        }
      }
    }
  }

  var finalStates = nfa.finalStates();
  for (i = 0; i < finalStates.length; i++) {
    states[finalStates[i].label].classList.add('final');
  }
}

NFAVisualizer.getStateCoordinates = function(state) {
  return { x: parseInt(state.getAttribute('cx')), y: parseInt(state.getAttribute('cy')) };
}

NFAVisualizer.getCurveControlPoints = function(distance, factor, direction) {
  var points = {};
  points['x1'] = distance * (direction == 'r' ? 0.25 : -0.25);
  points['y1'] = distance / (direction == 'r' ? -factor : factor);
  points['x2'] = distance * (direction == 'r' ? 0.75 : -0.75);
  points['y2'] = distance / (direction == 'r' ? -factor : factor);
  return points;
}

NFAVisualizer.generatePathDefinition = function(source, control, destination) {
  return 'M' +  source.x + ',' + source.y 
    + ' C' + (source.x + control.x1) + ',' + (source.y + control.y1) + ' ' 
    + (source.x + control.x2) + ',' + (source.y + control.y2) + ' ' 
    + destination.x + ',' + destination.y;
}

NFAVisualizer.getStateLabel = function(state) {
  var label = document.createElement('p');
  label.textContent = state.getAttribute('label');
  label.style.top = state.getAttribute('cy') + 'px';
  label.style.left = state.getAttribute('cx') + 'px';
  return label;
}

NFAVisualizer.getTransitionLabel = function(source, control, symbol) {
  var label = document.createElement('span');
  label.textContent = symbol;
  var top = source.y + control.y1 * 0.75;
  label.style.top = top + (source.y >= top ? -5 : 5) + 'px';
  label.style.left = source.x + (control.x1 + control.x2) / 2 + 'px';
  return label;
}

NFAVisualizer.getArrowHead = function(origin, angle) {
  var left = Math.coordinates(origin, 6, angle + 25);
  var right = Math.coordinates(origin, 6, angle - 25);
  left = SVG.create('path', { d: 'M' + origin.x + ',' + origin.y + ' L' + left.x + ',' + left.y });
  right = SVG.create('path', { d: 'M' + origin.x + ',' + origin.y + ' L' + right.x + ',' + right.y });
  return { left: left, right: right };
}





function SVG() {}
SVG.create = function(type, attributes) {
  var element = document.createElementNS('http://www.w3.org/2000/svg', type);
  if (attributes && typeof attributes == 'object') {
    for (var attribute in attributes) {
      element.setAttribute(attribute, attributes[attribute]);
    }
  }
  return element;
}





Math.distance = function(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

Math.angle = function(p1, p2) {
  var angle = Math.atan((p2.y - p1.y) / (p2.x - p1.x));
  angle *= 180 / Math.PI;
  if (p2.x >= p1.x && p2.y < p1.y) {
    angle =  -angle;
  } else if (p2.x < p1.x && p2.y < p1.y || p2.x < p1.x && p2.y >= p1.y) {
    angle = 180 - angle;
  } else if (p2.x >= p1.x && p2.y >= p1.y) {
    angle = 360 - angle;
  }
  return angle % 360;
}

Math.coordinates = function(origin, length, angle) {
  angle *= Math.PI / 180;
  var x = origin.x + Math.cos(angle) * length;
  var y = origin.y - Math.sin(angle) * length;
  return { x: x, y: y };
}