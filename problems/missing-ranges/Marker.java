import java.util.*;
class Marker {
    public List<String> findMissingRanges(int[] nums, int lower, int upper) {
        List<String> res = new ArrayList<>();
        long prev = (long) lower - 1;
        for (int i = 0; i <= nums.length; i++) {
            long cur = (i < nums.length) ? (long) nums[i] : (long) upper + 1;
            if (cur - prev >= 2) {
                long a = prev + 1, b = cur - 1;
                if (a == b) res.add(String.valueOf(a));
                else res.add(a + "->" + b);
            }
            prev = cur;
        }
        return res;
    }
    public boolean isCorrect(int[] nums, int lower, int upper, List<String> output) {
        return findMissingRanges(nums, lower, upper).equals(output);
    }
}
