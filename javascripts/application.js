var regex = 'a*b(a*bb+ab+a*b)+b*';
var nfa = RegexParser.parse(regex); 
NFAVisualizer.visualize('#nfa', nfa);