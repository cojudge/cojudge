import java.util.*;
class Marker {
    public int[][] merge(int[][] intervals) {
        if (intervals == null || intervals.length == 0) return new int[0][0];
        Arrays.sort(intervals, (a,b) -> Integer.compare(a[0], b[0]));
        List<int[]> res = new ArrayList<>();
        int[] cur = intervals[0].clone();
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] <= cur[1]) {
                cur[1] = Math.max(cur[1], intervals[i][1]);
            } else {
                res.add(cur);
                cur = intervals[i].clone();
            }
        }
        res.add(cur);
        return res.toArray(new int[res.size()][]);
    }

    private boolean deepEquals(int[][] a, int[][] b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;
        for (int i = 0; i < a.length; i++) {
            if (a[i].length != b[i].length) return false;
            for (int j = 0; j < a[i].length; j++) if (a[i][j] != b[i][j]) return false;
        }
        return true;
    }

    public boolean isCorrect(int[][] intervals, int[][] output) {
        int[][] ans = merge(intervals);
        return deepEquals(ans, output);
    }
}
