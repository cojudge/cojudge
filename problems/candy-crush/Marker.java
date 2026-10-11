import java.util.*;
class Marker {
    public List<String> candyCrush(char[][] board) {
        int m = board.length, n = board[0].length;
        int[][] g = new int[m][n];
        for (int r = 0; r < m; r++) for (int c = 0; c < n; c++) g[r][c] = board[r][c] - '0';
        while (true) {
            boolean[][] crush = new boolean[m][n];
            boolean any = false;
            for (int r = 0; r < m; r++) {
                int c = 0;
                while (c < n) {
                    if (g[r][c] == 0) { c++; continue; }
                    int nc = c;
                    while (nc < n && g[r][nc] == g[r][c]) nc++;
                    if (nc - c >= 3) { for (int k = c; k < nc; k++) crush[r][k] = true; any = true; }
                    c = nc;
                }
            }
            for (int c = 0; c < n; c++) {
                int r = 0;
                while (r < m) {
                    if (g[r][c] == 0) { r++; continue; }
                    int nr = r;
                    while (nr < m && g[nr][c] == g[r][c]) nr++;
                    if (nr - r >= 3) { for (int k = r; k < nr; k++) crush[k][c] = true; any = true; }
                    r = nr;
                }
            }
            if (!any) break;
            for (int r = 0; r < m; r++) for (int c = 0; c < n; c++) if (crush[r][c]) g[r][c] = 0;
            for (int c = 0; c < n; c++) {
                int w = m - 1;
                for (int r = m - 1; r >= 0; r--) {
                    if (g[r][c] != 0) { g[w][c] = g[r][c]; w--; }
                }
                for (int r = w; r >= 0; r--) g[r][c] = 0;
            }
        }
        List<String> ans = new ArrayList<>();
        for (int r = 0; r < m; r++) {
            StringBuilder sb = new StringBuilder();
            for (int c = 0; c < n; c++) sb.append((char)('0' + g[r][c]));
            ans.add(sb.toString());
        }
        return ans;
    }
    private char[][] copyOf(char[][] b) {
        char[][] c = new char[b.length][];
        for (int i = 0; i < b.length; i++) c[i] = b[i].clone();
        return c;
    }
    public boolean isCorrect(char[][] board, List<String> output) {
        if (output == null) return false;
        return candyCrush(copyOf(board)).equals(output);
    }
}
