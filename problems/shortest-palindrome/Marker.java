import java.util.*;
class Marker {
    public String shortestPalindrome(String s) {
        String rev = new StringBuilder(s).reverse().toString();
        String combo = s + "#" + rev;
        int[] pi = new int[combo.length()];
        for (int i = 1; i < combo.length(); i++) {
            int j = pi[i - 1];
            while (j > 0 && combo.charAt(i) != combo.charAt(j)) j = pi[j - 1];
            if (combo.charAt(i) == combo.charAt(j)) j++;
            pi[i] = j;
        }
        int keep = pi[combo.length() - 1];
        String suffix = s.substring(keep);
        return new StringBuilder(suffix).reverse().toString() + s;
    }
    public boolean isCorrect(String s, String output) {
        return shortestPalindrome(s).equals(output);
    }
}
