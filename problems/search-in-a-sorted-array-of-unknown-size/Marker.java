import java.util.*;
class Marker {
    public int search(int[] arr, int target) {
        int lo = 0, hi = arr.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
    public boolean isCorrect(int[] arr, int target, int output) {
        return search(arr.clone(), target) == output;
    }
}
