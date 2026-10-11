import java.util.*;
class Marker {
    public int lengthOfLongestSubstringTwoDistinct(String s) {
        if (s == null || s.length() == 0) return 0;
        Map<Character, Integer> count = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            count.put(c, count.getOrDefault(c, 0) + 1);
            while (count.size() > 2) {
                char lc = s.charAt(left);
                int v = count.get(lc) - 1;
                if (v == 0) count.remove(lc);
                else count.put(lc, v);
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
    public boolean isCorrect(String s, int output) {
        return lengthOfLongestSubstringTwoDistinct(s) == output;
    }
}
