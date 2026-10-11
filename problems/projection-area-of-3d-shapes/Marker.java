class Marker {
    public int projectionArea(int[][] grid) {
        int n = grid.length;
        int top = 0, front = 0, side = 0;
        for (int i = 0; i < n; i++) {
            int rowMax = 0;
            for (int j = 0; j < n; j++) {
                if (grid[i][j] > 0) top++;
                rowMax = Math.max(rowMax, grid[i][j]);
            }
            front += rowMax;
        }
        for (int j = 0; j < n; j++) {
            int colMax = 0;
            for (int i = 0; i < n; i++) colMax = Math.max(colMax, grid[i][j]);
            side += colMax;
        }
        return top + front + side;
    }
    public boolean isCorrect(int[][] grid, int output) {
        return projectionArea(grid) == output;
    }
}
