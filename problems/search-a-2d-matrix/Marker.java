class Marker {
    public boolean searchMatrix(int[][] matrix, int target) {
        int rows = matrix.length;
        int columns = matrix[0].length;
        int left = 0;
        int right = rows * columns - 1;

        while (left <= right) {
            int middle = left + (right - left) / 2;
            int value = matrix[middle / columns][middle % columns];
            if (value == target) return true;
            if (value < target) {
                left = middle + 1;
            } else {
                right = middle - 1;
            }
        }
        return false;
    }

    public boolean isCorrect(int[][] matrix, int target, boolean output) {
        return output == searchMatrix(matrix, target);
    }
}
