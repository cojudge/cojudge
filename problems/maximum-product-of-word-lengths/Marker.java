import java.util.*;
class Marker {
    public int maxProduct(String[] words) {
        int n = words.length;
        int[] masks = new int[n];
        for (int i = 0; i < n; i++) {
            int m = 0;
            for (char c : words[i].toCharArray()) m |= 1 << (c - 'a');
            masks[i] = m;
        }
        int best = 0;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if ((masks[i] & masks[j]) == 0) {
                    best = Math.max(best, words[i].length() * words[j].length());
                }
            }
        }
        return best;
    }
    public boolean isCorrect(String[] words, int output) {
        return maxProduct(words) == output;
    }
}
