import java.util.*;
class Marker {
    private static final int[][] DIRS = {
        {-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}
    };
    public List<String> updateBoard(char[][] board, int[] click) {
        int r = click[0], c = click[1];
        if (board[r][c] == 'M') {
            board[r][c] = 'X';
        } else {
            reveal(board, r, c);
        }
        List<String> ans = new ArrayList<>();
        for (char[] row : board) ans.add(new String(row));
        return ans;
    }
    private void reveal(char[][] b, int r, int c) {
        int m = b.length, n = b[0].length;
        if (r < 0 || r >= m || c < 0 || c >= n || b[r][c] != 'E') return;
        int mines = 0;
        for (int[] d : DIRS) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < m && nc >= 0 && nc < n &&
                (b[nr][nc] == 'M' || b[nr][nc] == 'X')) mines++;
        }
        if (mines > 0) {
            b[r][c] = (char) ('0' + mines);
        } else {
            b[r][c] = 'B';
            for (int[] d : DIRS) reveal(b, r + d[0], c + d[1]);
        }
    }
    private char[][] copyOf(char[][] b) {
        char[][] c = new char[b.length][];
        for (int i = 0; i < b.length; i++) c[i] = b[i].clone();
        return c;
    }
    public boolean isCorrect(char[][] board, int[] click, List<String> output) {
        if (output == null) return false;
        return updateBoard(copyOf(board), click.clone()).equals(output);
    }
}
