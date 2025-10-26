import java.util.*;
class Marker {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> res = new ArrayList<>();
        int i = 0, n = intervals.length;
        int start = newInterval[0], end = newInterval[1];
        // add all intervals ending before newInterval starts
        while (i < n && intervals[i][1] < start) {
            res.add(intervals[i++]);
        }
        // merge all overlapping intervals
        while (i < n && intervals[i][0] <= end) {
            start = Math.min(start, intervals[i][0]);
            end = Math.max(end, intervals[i][1]);
            i++;
        }
        res.add(new int[]{start, end});
        // add the rest
        while (i < n) res.add(intervals[i++]);
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

    public boolean isCorrect(int[][] intervals, int[] newInterval, int[][] output) {
        int[][] ans = insert(intervals, newInterval);
        return deepEquals(ans, output);
    }
}
