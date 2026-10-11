import java.util.*;
class Marker {
    public int[] kthSmallestPrimeFraction(int[] arr, int k) {
        int n = arr.length;
        List<int[]> pairs = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                pairs.add(new int[]{arr[i], arr[j]});
            }
        }
        pairs.sort((a, b) -> Long.compare((long) a[0] * b[1], (long) b[0] * a[1]));
        return pairs.get(k - 1);
    }
    public boolean isCorrect(int[] arr, int k, int[] output) {
        if (output == null || output.length != 2) return false;
        int[] expected = kthSmallestPrimeFraction(arr, k);
        if (output[0] == expected[0] && output[1] == expected[1]) return true;
        Set<Integer> set = new HashSet<>();
        for (int v : arr) set.add(v);
        if (!set.contains(output[0]) || !set.contains(output[1])) return false;
        int i1 = -1, i2 = -1;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == output[0]) i1 = i;
            if (arr[i] == output[1]) i2 = i;
        }
        if (i1 < 0 || i2 < 0 || i1 >= i2) return false;
        return (long) output[0] * expected[1] == (long) output[1] * expected[0];
    }
}
