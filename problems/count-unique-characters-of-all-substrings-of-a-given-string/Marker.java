import java.util.*;
class Marker {
    public int uniqueLetterString(String s) {
        int n = s.length();
        int[] last2 = new int[26];
        int[] last1 = new int[26];
        Arrays.fill(last2, -1);
        Arrays.fill(last1, -1);
        long ans = 0;
        long mod = 1000000007L;
        for (int i = 0; i < n; i++) {
            int c = s.charAt(i) - 'A';
            ans += (long) (i - last1[c]) * (last1[c] - last2[c]);
            last2[c] = last1[c];
            last1[c] = i;
        }
        for (int c = 0; c < 26; c++) {
            ans += (long) (n - last1[c]) * (last1[c] - last2[c]);
        }
        return (int) (ans % mod);
    }
    public boolean isCorrect(String s, int output) {
        return uniqueLetterString(s) == output;
    }
}
