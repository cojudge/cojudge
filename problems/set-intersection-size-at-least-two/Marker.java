import java.util.*;
class Marker {
    public int intersectionSizeTwo(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[1] != b[1] ? a[1] - b[1] : b[0] - a[0]);
        int ans = 0;
        int p1 = -1, p2 = -1;
        for (int[] iv : intervals) {
            int s = iv[0], e = iv[1];
            if (s <= p1) continue;
            if (s <= p2) { ans += 1; p1 = p2; p2 = e; }
            else { ans += 2; p1 = e - 1; p2 = e; }
        }
        return ans;
    }
    public boolean isCorrect(int[][] intervals, int output) {
        int[][] copy = new int[intervals.length][];
        for (int i = 0; i < intervals.length; i++) copy[i] = intervals[i].clone();
        return intersectionSizeTwo(copy) == output;
    }
}
