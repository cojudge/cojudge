import java.util.*;
class Marker {
    public boolean circularArrayLoop(int[] nums) {
        int n = nums.length;
        for (int start = 0; start < n; start++) {
            boolean fwd = nums[start] > 0;
            Set<Integer> seen = new HashSet<>();
            seen.add(start);
            int cur = start;
            for (int step = 0; step < n; step++) {
                if ((nums[cur] > 0) != fwd) break;
                int nxt = ((cur + nums[cur]) % n + n) % n;
                if (nxt == cur) break;
                if (seen.contains(nxt)) return true;
                seen.add(nxt);
                cur = nxt;
            }
        }
        return false;
    }
    public boolean isCorrect(int[] nums, boolean output) {
        return circularArrayLoop(nums) == output;
    }
}
