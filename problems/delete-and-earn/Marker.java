import java.util.*;
class Marker {
    public int deleteAndEarn(int[] nums) {
        int mx = 0;
        for (int v : nums) mx = Math.max(mx, v);
        long[] pts = new long[mx + 1];
        for (int v : nums) pts[v] += v;
        long take = 0, skip = 0;
        for (int v = 0; v <= mx; v++) {
            long nt = skip + pts[v];
            long ns = Math.max(skip, take);
            take = nt; skip = ns;
        }
        return (int)Math.max(take, skip);
    }
    public boolean isCorrect(int[] nums, int output) {
        return deleteAndEarn(nums) == output;
    }
}
