import java.util.*;
class Marker {
    @SuppressWarnings("unchecked")
    public int numberOfArithmeticSlices(int[] nums) {
        int n = nums.length;
        long ans = 0;
        List<Map<Long, Integer>> dp = new ArrayList<>(n);
        for (int i = 0; i < n; i++) dp.add(new HashMap<>());
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                long diff = (long) nums[i] - nums[j];
                int cntJ = dp.get(j).getOrDefault(diff, 0);
                int cntI = dp.get(i).getOrDefault(diff, 0);
                ans += cntJ;
                dp.get(i).put(diff, cntI + cntJ + 1);
            }
        }
        return (int) ans;
    }
    public boolean isCorrect(int[] nums, int output) {
        return numberOfArithmeticSlices(nums) == output;
    }
}
