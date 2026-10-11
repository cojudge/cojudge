import java.util.*;
class Marker {
    public String originalDigits(String s) {
        int[] cnt = new int[26];
        for (char c : s.toCharArray()) cnt[c - 'a']++;
        int[] d = new int[10];
        d[0] = cnt['z' - 'a'];
        d[2] = cnt['w' - 'a'];
        d[4] = cnt['u' - 'a'];
        d[6] = cnt['x' - 'a'];
        d[8] = cnt['g' - 'a'];
        d[3] = cnt['h' - 'a'] - d[8];
        d[5] = cnt['f' - 'a'] - d[4];
        d[7] = cnt['s' - 'a'] - d[6];
        d[1] = cnt['o' - 'a'] - d[0] - d[2] - d[4];
        d[9] = cnt['i' - 'a'] - d[5] - d[6] - d[8];
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            for (int k = 0; k < d[i]; k++) sb.append((char) ('0' + i));
        }
        return sb.toString();
    }
    public boolean isCorrect(String s, String output) {
        return originalDigits(s).equals(output);
    }
}
