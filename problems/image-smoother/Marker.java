import java.util.*;
class Marker {
    public int[][] imageSmoother(int[][] img) {
        int m = img.length, n = img[0].length;
        int[][] ans = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int sum = 0, cnt = 0;
                for (int di = -1; di <= 1; di++) {
                    for (int dj = -1; dj <= 1; dj++) {
                        int ni = i + di, nj = j + dj;
                        if (ni >= 0 && ni < m && nj >= 0 && nj < n) { sum += img[ni][nj]; cnt++; }
                    }
                }
                ans[i][j] = sum / cnt;
            }
        }
        return ans;
    }
    public boolean isCorrect(int[][] img, int[][] output) {
        int[][] exp = imageSmoother(img);
        if (output == null || output.length != exp.length) return false;
        for (int i = 0; i < exp.length; i++) {
            if (output[i] == null || output[i].length != exp[i].length) return false;
            for (int j = 0; j < exp[i].length; j++) if (output[i][j] != exp[i][j]) return false;
        }
        return true;
    }
}
