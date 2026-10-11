import java.util.*;
class Marker {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> ans = new ArrayList<>();
        int n = s.length(), m = p.length();
        if (m > n) return ans;
        int[] need = new int[26];
        int[] win = new int[26];
        for (char c : p.toCharArray()) need[c - 'a']++;
        for (int i = 0; i < n; i++) {
            win[s.charAt(i) - 'a']++;
            if (i >= m) win[s.charAt(i - m) - 'a']--;
            if (i >= m - 1 && Arrays.equals(need, win)) ans.add(i - m + 1);
        }
        return ans;
    }
    public boolean isCorrect(String s, String p, List<Integer> output) {
        if (output == null) return false;
        List<Integer> expected = findAnagrams(s, p);
        Collections.sort(expected);
        List<Integer> got = new ArrayList<>(output);
        Collections.sort(got);
        return expected.equals(got);
    }
}
