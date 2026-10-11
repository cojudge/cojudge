import java.util.*;
class Marker {
    public boolean validWordSquare(String[] words) {
        int n = words.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < words[i].length(); j++) {
                if (j >= n) return false;
                if (i >= words[j].length()) return false;
                if (words[i].charAt(j) != words[j].charAt(i)) return false;
            }
        }
        return true;
    }
    public boolean isCorrect(String[] words, boolean output) {
        return output == validWordSquare(words);
    }
}
