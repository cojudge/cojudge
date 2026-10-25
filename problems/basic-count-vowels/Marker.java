import java.util.*;
class Marker {
    public int countVowels(String s) {
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = Character.toLowerCase(s.charAt(i));
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') count++;
        }
        return count;
    }
    public boolean isCorrect(String s, int output) {
        return countVowels(s) == output;
    }
}
