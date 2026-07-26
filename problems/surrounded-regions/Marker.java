import java.util.*;

class Marker {
    private static final int[][] DIRECTIONS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public List<String> solve(String[] board) {
        int rows = board.length;
        int cols = board[0].length();
        char[][] cells = new char[rows][];
        for (int row = 0; row < rows; row++) cells[row] = board[row].toCharArray();

        Deque<int[]> queue = new ArrayDeque<>();
        for (int row = 0; row < rows; row++) {
            markBoundary(cells, row, 0, queue);
            markBoundary(cells, row, cols - 1, queue);
        }
        for (int col = 0; col < cols; col++) {
            markBoundary(cells, 0, col, queue);
            markBoundary(cells, rows - 1, col, queue);
        }

        while (!queue.isEmpty()) {
            int[] cell = queue.remove();
            for (int[] direction : DIRECTIONS) {
                int nextRow = cell[0] + direction[0];
                int nextCol = cell[1] + direction[1];
                if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
                if (cells[nextRow][nextCol] != 'O') continue;
                cells[nextRow][nextCol] = '#';
                queue.add(new int[]{nextRow, nextCol});
            }
        }

        List<String> result = new ArrayList<>(rows);
        for (char[] row : cells) {
            for (int col = 0; col < row.length; col++) {
                if (row[col] == 'O') row[col] = 'X';
                if (row[col] == '#') row[col] = 'O';
            }
            result.add(new String(row));
        }
        return result;
    }

    private void markBoundary(char[][] cells, int row, int col, Deque<int[]> queue) {
        if (cells[row][col] != 'O') return;
        cells[row][col] = '#';
        queue.add(new int[]{row, col});
    }

    public boolean isCorrect(String[] board, List<String> output) {
        return output != null && solve(board.clone()).equals(output);
    }
}
