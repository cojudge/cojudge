import java.util.*;
class Marker {
    public boolean containsNearbyAlmostDuplicate(int[] nums, int indexDiff, int valueDiff) {
        if (indexDiff < 0 || valueDiff < 0) return false;
        TreeSet<Long> window = new TreeSet<>();
        for (int i = 0; i < nums.length; i++) {
            long v = nums[i];
            Long ceil = window.ceiling(v);
            if (ceil != null && ceil - v <= (long) valueDiff) return true;
            Long floor = window.floor(v);
            if (floor != null && v - floor <= (long) valueDiff) return true;
            window.add(v);
            if (window.size() > indexDiff) window.remove((long) nums[i - indexDiff]);
        }
        return false;
    }
    public boolean isCorrect(int[] nums, int indexDiff, int valueDiff, boolean output) {
        return output == containsNearbyAlmostDuplicate(nums, indexDiff, valueDiff);
    }
}
