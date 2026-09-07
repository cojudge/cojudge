import java.util.*;
class Marker {
    public int[] findClosestElements(int[] arr, int k, int x) {
        int n = arr.length;
        int left = 0, right = n - 1;
        while (right - left + 1 > k) {
            int dl = Math.abs(arr[left] - x);
            int dr = Math.abs(arr[right] - x);
            if (dl > dr) left++;
            else right--;
        }
        return Arrays.copyOfRange(arr, left, left + k);
    }
    public boolean isCorrect(int[] arr, int k, int x, int[] output) {
        return Arrays.equals(findClosestElements(arr, k, x), output);
    }
}
