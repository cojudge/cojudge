class Marker {
    public boolean isToeplitzMatrix(int[][] matrix) {
        for (int r = 1; r < matrix.length; r++) {
            for (int c = 1; c < matrix[r].length; c++) {
                if (matrix[r][c] != matrix[r - 1][c - 1]) return false;
            }
        }
        return true;
    }
    public boolean isCorrect(int[][] matrix, boolean output) {
        return output == isToeplitzMatrix(matrix);
    }
}
