import java.util.*;
class Marker {
    public int[] findRightInterval(int[][] intervals) {
        int n = intervals.length;
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) order[i] = i;
        Arrays.sort(order, (a, b) -> Integer.compare(intervals[a][0], intervals[b][0]));
        int[] starts = new int[n];
        for (int i = 0; i < n; i++) starts[i] = intervals[order[i]][0];
        int[] ans = new int[n];
        for (int i = 0; i < n; i++) {
            int end = intervals[i][1];
            int lo = 0, hi = n;
            while (lo < hi) {
                int mid = (lo + hi) / 2;
                if (starts[mid] >= end) hi = mid;
                else lo = mid + 1;
            }
            ans[i] = (lo == n) ? -1 : order[lo];
        }
        return ans;
    }
    public boolean isCorrect(int[][] intervals, int[] output) {
        return Arrays.equals(findRightInterval(intervals), output);
    }
}
