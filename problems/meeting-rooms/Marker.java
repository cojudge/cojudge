import java.util.*;
class Marker {
    public boolean canAttendMeetings(int[][] intervals) {
        Arrays.sort(intervals, (a,b) -> Integer.compare(a[0], b[0]));
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < intervals[i-1][1]) return false;
        }
        return true;
    }

    public boolean isCorrect(int[][] intervals, boolean output) {
        return canAttendMeetings(intervals) == output;
    }
}
