var regex = 'a*(a+b*)+(b*b+a*+b*a*)*';
var nfa = RegexParser.parse(regex); 
NFAVisualizer.visualize('#nfa', nfa);