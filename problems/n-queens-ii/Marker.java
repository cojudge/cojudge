import java.util.*;

class Marker {
    public int totalNQueens(int n) {
        boolean[] cols = new boolean[n];
        boolean[] diags = new boolean[2 * n - 1];
        boolean[] antiDiags = new boolean[2 * n - 1];
        return count(n, 0, cols, diags, antiDiags);
    }

    private int count(int n, int row, boolean[] cols, boolean[] diags, boolean[] antiDiags) {
        if (row == n) {
            return 1;
        }
        int total = 0;
        for (int col = 0; col < n; col++) {
            int diag = row - col + n - 1;
            int antiDiag = row + col;
            if (cols[col] || diags[diag] || antiDiags[antiDiag]) continue;
            cols[col] = diags[diag] = antiDiags[antiDiag] = true;
            total += count(n, row + 1, cols, diags, antiDiags);
            cols[col] = diags[diag] = antiDiags[antiDiag] = false;
        }
        return total;
    }

    public boolean isCorrect(int n, int output) {
        return totalNQueens(n) == output;
    }
}