import java.util.*;
class Marker {
    public List<String> summaryRanges(int[] nums) {
        List<String> res = new ArrayList<>();
        int i = 0;
        while (i < nums.length) {
            int start = nums[i];
            while (i + 1 < nums.length && (long) nums[i + 1] == (long) nums[i] + 1) i++;
            int end = nums[i];
            if (start == end) res.add(String.valueOf(start));
            else res.add(start + "->" + end);
            i++;
        }
        return res;
    }
    public boolean isCorrect(int[] nums, List<String> output) {
        return summaryRanges(nums).equals(output);
    }
}
