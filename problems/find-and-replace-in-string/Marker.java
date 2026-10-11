import java.util.*;
class Marker {
    public String findReplaceString(String s, int[] indices, String[] sources, String[] targets) {
        int n = indices.length;
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) order[i] = i;
        Arrays.sort(order, (a, b) -> Integer.compare(indices[a], indices[b]));
        StringBuilder ans = new StringBuilder();
        int pos = 0;
        for (int oi : order) {
            int idx = indices[oi];
            if (idx < pos) continue;
            while (pos < idx && pos < s.length()) {
                ans.append(s.charAt(pos));
                pos++;
            }
            if (s.startsWith(sources[oi], idx)) {
                ans.append(targets[oi]);
                pos = idx + sources[oi].length();
            }
        }
        while (pos < s.length()) {
            ans.append(s.charAt(pos));
            pos++;
        }
        return ans.toString();
    }
    public boolean isCorrect(String s, int[] indices, String[] sources, String[] targets, String output) {
        return findReplaceString(s, indices, sources, targets).equals(output);
    }
}
