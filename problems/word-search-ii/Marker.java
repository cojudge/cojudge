import java.util.*;
class Marker {
    static class T {
        T[] next = new T[26];
        String word;
    }
    private T build(String[] words) {
        T root = new T();
        for (String w : words) {
            T cur = root;
            for (int i = 0; i < w.length(); i++) {
                int c = w.charAt(i) - 'a';
                if (cur.next[c] == null) cur.next[c] = new T();
                cur = cur.next[c];
            }
            cur.word = w;
        }
        return root;
    }
    public List<String> findWords(char[][] board, String[] words) {
        int m = board.length, n = board[0].length;
        boolean[][] vis = new boolean[m][n];
        Set<String> ans = new HashSet<>();
        T root = build(words);
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                dfs(board, i, j, root, vis, ans);
            }
        }
        return new ArrayList<>(ans);
    }
    private void dfs(char[][] b, int i, int j, T node, boolean[][] vis, Set<String> out) {
        if (i < 0 || j < 0 || i >= b.length || j >= b[0].length || vis[i][j]) return;
        char ch = b[i][j];
        int c = ch - 'a';
        if (c < 0 || c >= 26 || node.next[c] == null) return;
        node = node.next[c];
        if (node.word != null) out.add(node.word);
        vis[i][j] = true;
        dfs(b, i + 1, j, node, vis, out);
        dfs(b, i - 1, j, node, vis, out);
        dfs(b, i, j + 1, node, vis, out);
        dfs(b, i, j - 1, node, vis, out);
        vis[i][j] = false;
    }

    private boolean equalsAsSets(List<String> a, List<String> b) {
        if (a.size() != b.size()) return false;
        return new HashSet<>(a).equals(new HashSet<>(b));
    }

    public boolean isCorrect(char[][] board, String[] words, List<String> output) {
        List<String> ans = findWords(board, words);
        return equalsAsSets(ans, output);
    }
}
