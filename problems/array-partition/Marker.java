import java.util.*;
class Marker {
    public int arrayPairSum(int[] nums) {
        Arrays.sort(nums);
        int ans = 0;
        for (int i = 0; i < nums.length; i += 2) ans += nums[i];
        return ans;
    }
    public boolean isCorrect(int[] nums, int output) {
        return output == arrayPairSum(nums);
    }
}
