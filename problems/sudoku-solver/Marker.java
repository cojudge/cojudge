import java.util.*;
class Marker {
    public List<String> solveSudoku(String[] board) {
        char[][] g = new char[9][];
        for (int i = 0; i < 9; i++) g[i] = board[i].toCharArray();
        int[] rows = new int[9], cols = new int[9], boxes = new int[9];
        List<int[]> empties = new ArrayList<>();
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                char ch = g[r][c];
                if (ch == '.') empties.add(new int[]{r, c});
                else {
                    int bit = 1 << (ch - '1');
                    rows[r] |= bit;
                    cols[c] |= bit;
                    boxes[(r / 3) * 3 + c / 3] |= bit;
                }
            }
        }
        solve(g, rows, cols, boxes, empties, 0);
        List<String> ans = new ArrayList<>();
        for (char[] row : g) ans.add(new String(row));
        return ans;
    }
    private boolean solve(char[][] g, int[] rows, int[] cols, int[] boxes, List<int[]> e, int k) {
        if (k == e.size()) return true;
        int best = k, bestCount = 10;
        for (int i = k; i < e.size(); i++) {
            int[] cell = e.get(i);
            int cnt = Integer.bitCount(candidates(rows, cols, boxes, cell[0], cell[1]));
            if (cnt < bestCount) {
                bestCount = cnt;
                best = i;
                if (cnt <= 1) break;
            }
        }
        Collections.swap(e, k, best);
        int[] cell = e.get(k);
        int r = cell[0], c = cell[1], b = (r / 3) * 3 + c / 3;
        int mask = candidates(rows, cols, boxes, r, c);
        while (mask != 0) {
            int bit = mask & -mask;
            mask ^= bit;
            g[r][c] = (char) ('1' + Integer.numberOfTrailingZeros(bit));
            rows[r] |= bit;
            cols[c] |= bit;
            boxes[b] |= bit;
            if (solve(g, rows, cols, boxes, e, k + 1)) return true;
            rows[r] &= ~bit;
            cols[c] &= ~bit;
            boxes[b] &= ~bit;
            g[r][c] = '.';
        }
        Collections.swap(e, k, best);
        return false;
    }
    private int candidates(int[] rows, int[] cols, int[] boxes, int r, int c) {
        return (~(rows[r] | cols[c] | boxes[(r / 3) * 3 + c / 3])) & 0x1FF;
    }
    public boolean isCorrect(String[] board, List<String> output) {
        if (output == null || output.size() != 9) return false;
        char[][] g = new char[9][];
        for (int i = 0; i < 9; i++) {
            if (output.get(i) == null || output.get(i).length() != 9) return false;
            g[i] = output.get(i).toCharArray();
        }
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                char given = board[r].charAt(c);
                if (given != '.' && g[r][c] != given) return false;
                if (g[r][c] < '1' || g[r][c] > '9') return false;
            }
        }
        for (int i = 0; i < 9; i++) {
            int rm = 0, cm = 0, bm = 0;
            for (int j = 0; j < 9; j++) {
                rm |= 1 << (g[i][j] - '1');
                cm |= 1 << (g[j][i] - '1');
                int br = (i / 3) * 3 + j / 3, bc = (i % 3) * 3 + j % 3;
                bm |= 1 << (g[br][bc] - '1');
            }
            if (rm != 0x1FF || cm != 0x1FF || bm != 0x1FF) return false;
        }
        return true;
    }
}
