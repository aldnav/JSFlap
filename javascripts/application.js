var regex = 'a*a+ab*aa+a*b*';
var nfa = RegexParser.parse(regex); 
NFAVisualizer.visualize('#nfa', nfa);