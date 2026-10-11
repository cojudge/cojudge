import java.util.*;
class Marker {
    public List<List<String>> wordSquares(String[] words) {
        List<List<String>> ans = new ArrayList<>();
        if (words == null || words.length == 0) return ans;
        int n = words[0].length();
        Map<String, List<String>> pref = new HashMap<>();
        for (String w : words) {
            for (int i = 0; i <= n; i++) {
                String p = w.substring(0, i);
                pref.computeIfAbsent(p, k -> new ArrayList<>()).add(w);
            }
        }
        backtrack(new ArrayList<>(), n, pref, ans);
        return ans;
    }
    private void backtrack(List<String> cur, int n, Map<String, List<String>> pref, List<List<String>> ans) {
        if (cur.size() == n) {
            ans.add(new ArrayList<>(cur));
            return;
        }
        int r = cur.size();
        StringBuilder sb = new StringBuilder();
        for (String row : cur) sb.append(row.charAt(r));
        String need = sb.toString();
        List<String> cands = pref.getOrDefault(need, Collections.emptyList());
        for (String w : cands) {
            cur.add(w);
            backtrack(cur, n, pref, ans);
            cur.remove(cur.size() - 1);
        }
    }
    private List<String> canon(List<List<String>> g) {
        List<String> res = new ArrayList<>();
        for (List<String> sq : g) res.add(String.join(",", sq));
        Collections.sort(res);
        return res;
    }
    private boolean isValidSquare(List<String> sq, Set<String> dict) {
        int n = sq.size();
        if (n == 0) return false;
        for (String w : sq) {
            if (w.length() != n || !dict.contains(w)) return false;
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (sq.get(i).charAt(j) != sq.get(j).charAt(i)) return false;
            }
        }
        return true;
    }
    public boolean isCorrect(String[] words, List<List<String>> output) {
        Set<String> dict = new HashSet<>(Arrays.asList(words));
        if (output == null) return false;
        for (List<String> sq : output) {
            if (!isValidSquare(sq, dict)) return false;
        }
        List<List<String>> expected = wordSquares(words);
        return canon(expected).equals(canon(output));
    }
}
