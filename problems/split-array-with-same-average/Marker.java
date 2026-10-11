import java.util.*;
class Marker {
    public boolean splitArraySameAverage(int[] nums) {
        int n = nums.length;
        if (n == 1) return false;
        int total = 0;
        for (int v : nums) total += v;
        List<Set<Integer>> dp = new ArrayList<>();
        for (int i = 0; i <= n / 2; i++) dp.add(new HashSet<>());
        dp.get(0).add(0);
        for (int v : nums) {
            for (int k = n / 2; k >= 1; k--) {
                for (int s : new ArrayList<>(dp.get(k - 1))) dp.get(k).add(s + v);
            }
        }
        for (int k = 1; k <= n / 2; k++) {
            if ((total * k) % n == 0) {
                int target = (total * k) / n;
                if (dp.get(k).contains(target)) return true;
            }
        }
        return false;
    }
    public boolean isCorrect(int[] nums, boolean output) {
        return splitArraySameAverage(nums) == output;
    }
}
