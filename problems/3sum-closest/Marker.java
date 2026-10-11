import java.util.*;
class Marker {
    public int threeSumClosest(int[] nums, int target) {
        int[] a = nums.clone();
        Arrays.sort(a);
        int best = a[0] + a[1] + a[2];
        for (int i = 0; i < a.length - 2; i++) {
            int l = i + 1, r = a.length - 1;
            while (l < r) {
                int s = a[i] + a[l] + a[r];
                if (Math.abs(s - target) < Math.abs(best - target)) best = s;
                if (s < target) l++;
                else if (s > target) r--;
                else return target;
            }
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int target, int output) {
        int ref = threeSumClosest(nums, target);
        if (output == ref) return true;
        if (Math.abs(output - target) != Math.abs(ref - target)) return false;
        return existsSum(nums, output);
    }
    private boolean existsSum(int[] nums, int sum) {
        int[] a = nums.clone();
        Arrays.sort(a);
        for (int i = 0; i < a.length - 2; i++) {
            int l = i + 1, r = a.length - 1;
            while (l < r) {
                int s = a[i] + a[l] + a[r];
                if (s == sum) return true;
                if (s < sum) l++;
                else r--;
            }
        }
        return false;
    }
}
