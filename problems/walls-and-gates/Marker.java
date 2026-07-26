import java.util.*;

class Marker {
    private static final int EMPTY = 2147483647;
    private static final int[][] DIRECTIONS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public int[][] wallsAndGates(int[][] rooms) {
        int[][] result = deepCopy(rooms);
        int rows = result.length;
        int cols = result[0].length;
        Deque<int[]> queue = new ArrayDeque<>();
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                if (result[row][col] == 0) queue.add(new int[]{row, col});
            }
        }

        while (!queue.isEmpty()) {
            int[] cell = queue.remove();
            for (int[] direction : DIRECTIONS) {
                int nextRow = cell[0] + direction[0];
                int nextCol = cell[1] + direction[1];
                if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
                if (result[nextRow][nextCol] != EMPTY) continue;
                result[nextRow][nextCol] = result[cell[0]][cell[1]] + 1;
                queue.add(new int[]{nextRow, nextCol});
            }
        }
        return result;
    }

    public boolean isCorrect(int[][] rooms, int[][] output) {
        int[][] expected = wallsAndGates(deepCopy(rooms));
        return output != null && Arrays.deepEquals(expected, output);
    }

    private int[][] deepCopy(int[][] matrix) {
        int[][] copy = new int[matrix.length][];
        for (int i = 0; i < matrix.length; i++) copy[i] = matrix[i].clone();
        return copy;
    }
}
