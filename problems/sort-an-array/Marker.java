import java.util.*;
class Marker {
    public int[] sortArray(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a);
        return a;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        return Arrays.equals(sortArray(nums), output);
    }
}
