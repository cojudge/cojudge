import java.util.*;
class Marker {
    public int oddEvenJumps(int[] arr) {
        int n = arr.length;
        if (n == 0) return 0;
        boolean[] odd = new boolean[n];
        boolean[] even = new boolean[n];
        odd[n - 1] = true;
        even[n - 1] = true;
        TreeMap<Integer, Integer> map = new TreeMap<>();
        map.put(arr[n - 1], n - 1);
        int ans = 1;
        for (int i = n - 2; i >= 0; i--) {
            Integer hi = map.ceilingKey(arr[i]);
            Integer lo = map.floorKey(arr[i]);
            if (hi != null) odd[i] = even[map.get(hi)];
            if (lo != null) even[i] = odd[map.get(lo)];
            if (odd[i]) ans++;
            map.put(arr[i], i);
        }
        return ans;
    }
    public boolean isCorrect(int[] arr, int output) {
        return oddEvenJumps(arr) == output;
    }
}
