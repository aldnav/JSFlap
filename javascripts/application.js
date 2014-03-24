var regex = 'a*(a+b*a*)*+(b+a*b*)*';
var nfa = RegexParser.parse(regex); 
NFAVisualizer.visualize('#nfa', nfa);