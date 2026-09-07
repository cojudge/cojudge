import java.util.*;
class Marker {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        if (nums == null || k < 0) return false;
        Set<Integer> window = new HashSet<>();
        for (int i = 0; i < nums.length; i++) {
            if (window.contains(nums[i])) return true;
            window.add(nums[i]);
            if (window.size() > k) window.remove(nums[i - k]);
        }
        return false;
    }
    public boolean isCorrect(int[] nums, int k, boolean output) {
        return output == containsNearbyDuplicate(nums, k);
    }
}
