import java.util.*;
class Marker {
    public int[][] spiralMatrixIII(int rows, int cols, int rStart, int cStart) {
        int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        List<int[]> res = new ArrayList<>();
        int r = rStart, c = cStart, d = 0, step = 1;
        res.add(new int[]{r, c});
        while (res.size() < rows * cols) {
            for (int t = 0; t < 2; t++) {
                for (int s = 0; s < step; s++) {
                    r += dirs[d][0];
                    c += dirs[d][1];
                    if (r >= 0 && r < rows && c >= 0 && c < cols) {
                        res.add(new int[]{r, c});
                        if (res.size() >= rows * cols) break;
                    }
                }
                d = (d + 1) % 4;
                if (res.size() >= rows * cols) break;
            }
            step++;
        }
        return res.toArray(new int[0][]);
    }
    public boolean isCorrect(int rows, int cols, int rStart, int cStart, int[][] output) {
        return Arrays.deepEquals(spiralMatrixIII(rows, cols, rStart, cStart), output);
    }
}
