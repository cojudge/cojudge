import java.util.*;
class Marker {
    public int eraseOverlapIntervals(int[][] intervals) {
        if (intervals == null || intervals.length == 0) return 0;
        Arrays.sort(intervals, (a,b) -> a[1] != b[1] ? Integer.compare(a[1], b[1]) : Integer.compare(a[0], b[0]));
        int count = 0; // count of non-overlapping kept
        int end = Integer.MIN_VALUE;
        for (int[] in : intervals) {
            if (in[0] >= end) {
                count++;
                end = in[1];
            }
        }
        return intervals.length - count;
    }

    public boolean isCorrect(int[][] intervals, int output) {
        return eraseOverlapIntervals(intervals) == output;
    }
}
