import java.util.*;
class Marker {
    public int[] bubbleSort(int[] nums) {
        int[] a = nums.clone();
        for (int i = 0; i < a.length; i++) {
            for (int j = 0; j + 1 < a.length - i; j++) {
                if (a[j] > a[j + 1]) {
                    int t = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = t;
                }
            }
        }
        return a;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        return Arrays.equals(bubbleSort(nums), output);
    }
}
