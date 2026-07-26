import java.util.*;

class Marker {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        int[] queens = new int[n];
        boolean[] columns = new boolean[n];
        boolean[] descending = new boolean[2 * n - 1];
        boolean[] ascending = new boolean[2 * n - 1];
        placeQueens(0, n, queens, columns, descending, ascending, result);
        return result;
    }

    private void placeQueens(int row, int n, int[] queens, boolean[] columns,
                             boolean[] descending, boolean[] ascending,
                             List<List<String>> result) {
        if (row == n) {
            List<String> board = new ArrayList<>(n);
            for (int r = 0; r < n; r++) {
                char[] cells = new char[n];
                Arrays.fill(cells, '.');
                cells[queens[r]] = 'Q';
                board.add(new String(cells));
            }
            result.add(board);
            return;
        }

        for (int col = 0; col < n; col++) {
            int descendingIndex = row - col + n - 1;
            int ascendingIndex = row + col;
            if (columns[col] || descending[descendingIndex] || ascending[ascendingIndex]) continue;
            queens[row] = col;
            columns[col] = true;
            descending[descendingIndex] = true;
            ascending[ascendingIndex] = true;
            placeQueens(row + 1, n, queens, columns, descending, ascending, result);
            columns[col] = false;
            descending[descendingIndex] = false;
            ascending[ascendingIndex] = false;
        }
    }

    public boolean isCorrect(int n, List<List<String>> output) {
        List<List<String>> expected = canonicalize(solveNQueens(n));
        List<List<String>> actual = canonicalize(output);
        return actual != null && expected.equals(actual);
    }

    private List<List<String>> canonicalize(List<List<String>> boards) {
        if (boards == null) return null;
        List<List<String>> result = new ArrayList<>();
        for (List<String> board : boards) {
            if (board == null || board.contains(null)) return null;
            result.add(new ArrayList<>(board));
        }
        result.sort(this::compareBoards);
        return result;
    }

    private int compareBoards(List<String> a, List<String> b) {
        int limit = Math.min(a.size(), b.size());
        for (int i = 0; i < limit; i++) {
            int comparison = a.get(i).compareTo(b.get(i));
            if (comparison != 0) return comparison;
        }
        return Integer.compare(a.size(), b.size());
    }
}
