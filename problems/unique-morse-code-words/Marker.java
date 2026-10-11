import java.util.*;
class Marker {
    private static final String[] MORSE = {".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."};
    public int uniqueMorseRepresentations(String[] words) {
        Set<String> set = new HashSet<>();
        for (String w : words) {
            StringBuilder sb = new StringBuilder();
            for (char c : w.toCharArray()) sb.append(MORSE[c - 'a']);
            set.add(sb.toString());
        }
        return set.size();
    }
    public boolean isCorrect(String[] words, int output) {
        return uniqueMorseRepresentations(words) == output;
    }
}
