var regex = 'a*(ab(ab+a*+ba*)*)*';
var nfa = RegexParser.parse(regex); 
NFAVisualizer.visualize('#nfa', nfa);