import java.util.*;
class Marker {
    public int[] shuffleArray(int[] nums) {
        int[] a = nums.clone();
        Random rnd = new Random(42);
        for (int i = a.length - 1; i > 0; i--) {
            int j = rnd.nextInt(i + 1);
            int t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }
    public boolean isCorrect(int[] nums, int[] output) {
        if (output == null || output.length != nums.length) return false;
        int[] a = nums.clone();
        int[] b = output.clone();
        Arrays.sort(a);
        Arrays.sort(b);
        return Arrays.equals(a, b);
    }
}
