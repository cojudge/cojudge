import java.util.*;
class Marker {
    public int findLonelyPixel(char[][] picture) {
        int m = picture.length, n = picture[0].length;
        int[] rows = new int[m], cols = new int[n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (picture[i][j] == 'B') {
                    rows[i]++;
                    cols[j]++;
                }
            }
        }
        int ans = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (picture[i][j] == 'B' && rows[i] == 1 && cols[j] == 1) ans++;
            }
        }
        return ans;
    }
    public boolean isCorrect(char[][] picture, int output) {
        return findLonelyPixel(picture) == output;
    }
}
