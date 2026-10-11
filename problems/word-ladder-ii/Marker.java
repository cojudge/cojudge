import java.util.*;
class Marker {
    public List<List<String>> findLadders(String beginWord, String endWord, String[] wordList) {
        Set<String> dict = new HashSet<>(Arrays.asList(wordList));
        List<List<String>> ans = new ArrayList<>();
        if (!dict.contains(endWord)) return ans;
        dict.add(beginWord);
        Map<String, Integer> dist = new HashMap<>();
        Map<String, List<String>> pred = new HashMap<>();
        for (String w : dict) pred.put(w, new ArrayList<>());
        Queue<String> q = new LinkedList<>();
        q.add(beginWord);
        dist.put(beginWord, 0);
        boolean found = false;
        int level = 0;
        while (!q.isEmpty() && !found) {
            int size = q.size();
            level++;
            Set<String> visitedThisLevel = new HashSet<>();
            for (int i = 0; i < size; i++) {
                String word = q.poll();
                char[] ch = word.toCharArray();
                for (int p = 0; p < ch.length; p++) {
                    char orig = ch[p];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == orig) continue;
                        ch[p] = c;
                        String nb = new String(ch);
                        if (!dict.contains(nb)) continue;
                        if (!dist.containsKey(nb)) {
                            dist.put(nb, level);
                            pred.get(nb).add(word);
                            visitedThisLevel.add(nb);
                            q.add(nb);
                            if (nb.equals(endWord)) found = true;
                        } else if (dist.get(nb) == level) {
                            pred.get(nb).add(word);
                        }
                    }
                    ch[p] = orig;
                }
            }
        }
        if (!dist.containsKey(endWord)) return ans;
        LinkedList<String> path = new LinkedList<>();
        path.addFirst(endWord);
        dfs(endWord, beginWord, pred, path, ans);
        return ans;
    }

    private void dfs(String cur, String begin, Map<String, List<String>> pred,
                     LinkedList<String> path, List<List<String>> ans) {
        if (cur.equals(begin)) {
            ans.add(new ArrayList<>(path));
            return;
        }
        for (String p : pred.get(cur)) {
            path.addFirst(p);
            dfs(p, begin, pred, path, ans);
            path.removeFirst();
        }
    }

    private List<List<String>> canonicalize(List<List<String>> lists) {
        if (lists == null) return null;
        List<List<String>> res = new ArrayList<>();
        for (List<String> l : lists) {
            if (l == null) return null;
            res.add(new ArrayList<>(l));
        }
        res.sort(this::compareRows);
        return res;
    }

    private int compareRows(List<String> a, List<String> b) {
        int lim = Math.min(a.size(), b.size());
        for (int i = 0; i < lim; i++) {
            int c = a.get(i).compareTo(b.get(i));
            if (c != 0) return c;
        }
        return Integer.compare(a.size(), b.size());
    }

    public boolean isCorrect(String beginWord, String endWord, String[] wordList, List<List<String>> output) {
        List<List<String>> expected = canonicalize(findLadders(beginWord, endWord, wordList));
        List<List<String>> actual = canonicalize(output);
        return actual != null && expected.equals(actual);
    }
}
