import java.util.*;
class Marker {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int x : nums) set.add(x);
        int best = 0;
        for (int x : set) {
            if (!set.contains(x - 1)) {
                int y = x;
                int len = 1;
                while (set.contains(y + 1)) { y++; len++; }
                best = Math.max(best, len);
            }
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return longestConsecutive(nums) == output;
    }
}
