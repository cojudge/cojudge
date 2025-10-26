import java.util.Set;
import java.util.HashSet;
class Marker {
    public boolean containsDuplicate(int[] nums) {
        int n = nums.length;
        Set<Integer> s = new HashSet<>();
        for (int x : nums) {
            if (s.contains(x)) return true;
            s.add(x);
        }
        return false;
    }
    public boolean isCorrect(int[] nums, boolean ans) {
        return containsDuplicate(nums) == ans;
    }
}
