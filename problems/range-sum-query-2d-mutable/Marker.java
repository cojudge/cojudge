import java.util.*;
class Marker {
    public int[] runNumMatrix(int[][] matrix, String[] operations, int[][] values) {
        int m = matrix.length, n = matrix[0].length;
        int[][] a = new int[m][n];
        for (int i = 0; i < m; i++) a[i] = matrix[i].clone();
        List<Integer> ans = new ArrayList<>();
        for (int k = 0; k < operations.length; k++) {
            if (operations[k].equals("update")) {
                a[values[k][0]][values[k][1]] = values[k][2];
            } else {
                int s = 0;
                for (int i = values[k][0]; i <= values[k][2]; i++) {
                    for (int j = values[k][1]; j <= values[k][3]; j++) s += a[i][j];
                }
                ans.add(s);
            }
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(int[][] matrix, String[] operations, int[][] values, int[] output) {
        return Arrays.equals(runNumMatrix(matrix, operations, values), output);
    }
}
