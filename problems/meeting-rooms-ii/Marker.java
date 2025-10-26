import java.util.*;
class Marker {
    public int minMeetingRooms(int[][] intervals) {
        if (intervals == null || intervals.length == 0) return 0;
        int n = intervals.length;
        int[] starts = new int[n], ends = new int[n];
        for (int i = 0; i < n; i++) { starts[i] = intervals[i][0]; ends[i] = intervals[i][1]; }
        Arrays.sort(starts); Arrays.sort(ends);
        int i = 0, j = 0, rooms = 0, maxRooms = 0;
        while (i < n) {
            if (starts[i] < ends[j]) { rooms++; i++; }
            else { rooms--; j++; }
            maxRooms = Math.max(maxRooms, rooms);
        }
        return maxRooms;
    }

    public boolean isCorrect(int[][] intervals, int output) {
        return minMeetingRooms(intervals) == output;
    }
}
