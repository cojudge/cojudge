import java.util.*;
class Marker {
    public int numSquarefulPerms(int[] nums) {
        Arrays.sort(nums);
        boolean[] used = new boolean[nums.length];
        return dfs(nums, used, -1, 0);
    }
    private int dfs(int[] nums, boolean[] used, int prev, int placed) {
        if (placed == nums.length) {
            return 1;
        }
        int total = 0;
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) {
                continue;
            }
            if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) {
                continue;
            }
            if (prev != -1 && !isSquare(prev + nums[i])) {
                continue;
            }
            used[i] = true;
            total += dfs(nums, used, nums[i], placed + 1);
            used[i] = false;
        }
        return total;
    }
    private boolean isSquare(int s) {
        int r = (int) Math.sqrt(s);
        return r * r == s;
    }
    public boolean isCorrect(int[] nums, int output) {
        return numSquarefulPerms(nums) == output;
    }
}
