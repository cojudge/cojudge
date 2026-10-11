import java.util.*;
class Marker {
    public int largestOverlap(int[][] img1, int[][] img2) {
        List<int[]> a = new ArrayList<>();
        List<int[]> b = new ArrayList<>();
        int n = img1.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (img1[i][j] == 1) a.add(new int[]{i, j});
                if (img2[i][j] == 1) b.add(new int[]{i, j});
            }
        }
        if (a.isEmpty() || b.isEmpty()) return 0;
        Map<String, Integer> cnt = new HashMap<>();
        int best = 0;
        for (int[] p : a) {
            for (int[] q : b) {
                String key = (q[0] - p[0]) + "," + (q[1] - p[1]);
                int c = cnt.getOrDefault(key, 0) + 1;
                cnt.put(key, c);
                best = Math.max(best, c);
            }
        }
        return best;
    }
    public boolean isCorrect(int[][] img1, int[][] img2, int output) {
        return largestOverlap(img1, img2) == output;
    }
}
