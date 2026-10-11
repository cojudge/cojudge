class Marker {
    public boolean searchMatrix(int[][] matrix, int target) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        int r = 0;
        int c = cols - 1;
        while (r < rows && c >= 0) {
            if (matrix[r][c] == target) return true;
            if (matrix[r][c] > target) c--;
            else r++;
        }
        return false;
    }

    public boolean isCorrect(int[][] matrix, int target, boolean output) {
        return output == searchMatrix(matrix, target);
    }
}
