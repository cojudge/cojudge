import java.util.*;
class Marker {
    public int search(int[] secret, int target) {
        int lo = 0, hi = secret.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (secret[mid] == target) return mid;
            else if (secret[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
    public boolean isCorrect(int[] secret, int target, int output) {
        return search(secret.clone(), target) == output;
    }
}
