import java.util.*;
class Marker {
    public int minIncrementForUnique(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a);
        int moves = 0;
        for (int i = 1; i < a.length; i++) {
            if (a[i] <= a[i - 1]) {
                int need = a[i - 1] + 1;
                moves += need - a[i];
                a[i] = need;
            }
        }
        return moves;
    }
    public boolean isCorrect(int[] nums, int output) {
        return minIncrementForUnique(nums) == output;
    }
}
