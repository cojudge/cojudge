import java.util.*;
class Marker {
    public int threeSumSmaller(int[] nums, int target) {
        int[] a = nums.clone();
        Arrays.sort(a);
        int count = 0;
        for (int i = 0; i + 2 < a.length; i++) {
            int lo = i + 1, hi = a.length - 1;
            while (lo < hi) {
                if (a[i] + a[lo] + a[hi] < target) {
                    count += hi - lo;
                    lo++;
                } else {
                    hi--;
                }
            }
        }
        return count;
    }
    public boolean isCorrect(int[] nums, int target, int output) {
        return threeSumSmaller(nums.clone(), target) == output;
    }
}
