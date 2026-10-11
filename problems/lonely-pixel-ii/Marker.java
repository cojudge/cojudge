import java.util.*;
class Marker {
    public int findBlackPixel(char[][] picture, int n) {
        int m = picture.length, cols = picture[0].length;
        int[] rowCount = new int[m];
        int[] colCount = new int[cols];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < cols; j++) {
                if (picture[i][j] == 'B') {
                    rowCount[i]++;
                    colCount[j]++;
                }
            }
        }
        int ans = 0;
        for (int i = 0; i < m; i++) {
            if (rowCount[i] != n) continue;
            for (int j = 0; j < cols; j++) {
                if (picture[i][j] != 'B' || colCount[j] != n) continue;
                boolean ok = true;
                for (int r = 0; r < m; r++) {
                    if (picture[r][j] == 'B' && !Arrays.equals(picture[r], picture[i])) {
                        ok = false;
                        break;
                    }
                }
                if (ok) ans++;
            }
        }
        return ans;
    }
    public boolean isCorrect(char[][] picture, int n, int output) {
        return findBlackPixel(picture, n) == output;
    }
}
