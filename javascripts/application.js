var regex = 'a*a(b+a*+ba)*';
var nfa = RegexParser.parse(regex); 
NFAVisualizer.visualize('#nfa', nfa);