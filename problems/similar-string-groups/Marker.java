import java.util.*;
class Marker {
    private boolean similar(String a, String b) {
        int n = a.length();
        int d1 = -1, d2 = -1, cnt = 0;
        for (int i = 0; i < n; i++) {
            if (a.charAt(i) != b.charAt(i)) {
                cnt++;
                if (cnt == 1) d1 = i;
                else if (cnt == 2) d2 = i;
                else return false;
            }
        }
        if (cnt == 0) return true;
        if (cnt != 2) return false;
        return a.charAt(d1) == b.charAt(d2) && a.charAt(d2) == b.charAt(d1);
    }
    private int find(int[] p, int x) {
        if (p[x] != x) p[x] = find(p, p[x]);
        return p[x];
    }
    public int numSimilarGroups(String[] strs) {
        int n = strs.length;
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (similar(strs[i], strs[j])) {
                    int a = find(p, i), b = find(p, j);
                    if (a != b) p[a] = b;
                }
            }
        }
        Set<Integer> s = new HashSet<>();
        for (int i = 0; i < n; i++) s.add(find(p, i));
        return s.size();
    }
    public boolean isCorrect(String[] strs, int output) {
        return numSimilarGroups(strs) == output;
    }
}
