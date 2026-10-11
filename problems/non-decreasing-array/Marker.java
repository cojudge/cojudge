import java.util.*;
class Marker {
    public boolean checkPossibility(int[] nums) {
        int[] a = nums.clone();
        int cnt = 0;
        for (int i = 0; i + 1 < a.length; i++) {
            if (a[i] > a[i+1]) {
                cnt++;
                if (cnt > 1) return false;
                if (i == 0 || a[i-1] <= a[i+1]) a[i] = a[i+1];
                else a[i+1] = a[i];
            }
        }
        return true;
    }
    public boolean isCorrect(int[] nums, boolean output) {
        return output == checkPossibility(nums.clone());
    }
}
