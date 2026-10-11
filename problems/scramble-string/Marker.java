import java.util.*;
class Marker {
    private Map<String, Boolean> memo = new HashMap<>();
    public boolean isScramble(String s1, String s2) {
        memo.clear();
        if (s1.length() != s2.length()) return false;
        return dfs(s1, 0, s2, 0, s1.length());
    }
    private boolean dfs(String a, int i, String b, int j, int len) {
        String key = i + "," + j + "," + len;
        if (memo.containsKey(key)) return memo.get(key);
        String sub1 = a.substring(i, i + len);
        String sub2 = b.substring(j, j + len);
        if (sub1.equals(sub2)) {
            memo.put(key, true);
            return true;
        }
        int[] cnt = new int[26];
        for (int k = 0; k < len; k++) {
            cnt[sub1.charAt(k) - 'a']++;
            cnt[sub2.charAt(k) - 'a']--;
        }
        for (int c : cnt) {
            if (c != 0) {
                memo.put(key, false);
                return false;
            }
        }
        for (int k = 1; k < len; k++) {
            if (dfs(a, i, b, j, k) && dfs(a, i + k, b, j + k, len - k)) {
                memo.put(key, true);
                return true;
            }
            if (dfs(a, i, b, j + len - k, k) && dfs(a, i + k, b, j, len - k)) {
                memo.put(key, true);
                return true;
            }
        }
        memo.put(key, false);
        return false;
    }
    public boolean isCorrect(String s1, String s2, boolean output) {
        return output == isScramble(s1, s2);
    }
}
