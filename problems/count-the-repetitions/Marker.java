import java.util.*;
class Marker {
    public int getMaxRepetitions(String s1, int n1, String s2, int n2) {
        if (n1 == 0) return 0;
        int[] reps = new int[n1 + 1];
        Map<Integer, int[]> seen = new HashMap<>();
        int j = 0, cnt = 0;
        for (int k = 1; k <= n1; k++) {
            for (int i = 0; i < s1.length(); i++) {
                if (s1.charAt(i) == s2.charAt(j)) {
                    j++;
                    if (j == s2.length()) { j = 0; cnt++; }
                }
            }
            reps[k] = cnt;
            if (seen.containsKey(j)) {
                int[] prev = seen.get(j);
                int pk = prev[0], pcnt = prev[1];
                int cycleLen = k - pk, cycleCnt = cnt - pcnt;
                int remaining = n1 - pk;
                int total = pcnt + (remaining / cycleLen) * cycleCnt;
                total += reps[pk + (remaining % cycleLen)] - pcnt;
                return total / n2;
            } else {
                seen.put(j, new int[]{k, cnt});
            }
        }
        return reps[n1] / n2;
    }
    public boolean isCorrect(String s1, int n1, String s2, int n2, int output) {
        return getMaxRepetitions(s1, n1, s2, n2) == output;
    }
}
