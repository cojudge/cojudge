import java.util.*;
class Marker {
    public List<Integer> pancakeSort(int[] arr) {
        List<Integer> res = new ArrayList<>();
        int[] a = arr.clone();
        for (int size = a.length; size > 1; size--) {
            int mx = 0;
            for (int i = 1; i < size; i++) {
                if (a[i] > a[mx]) mx = i;
            }
            if (mx == size - 1) continue;
            if (mx != 0) {
                flip(a, mx);
                res.add(mx + 1);
            }
            flip(a, size - 1);
            res.add(size);
        }
        return res;
    }
    private void flip(int[] a, int k) {
        for (int i = 0, j = k; i < j; i++, j--) {
            int t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
    }
    public boolean isCorrect(int[] arr, List<Integer> output) {
        if (output == null || output.size() > 10 * arr.length) return false;
        int[] a = arr.clone();
        for (int k : output) {
            if (k < 1 || k > a.length) return false;
            for (int i = 0, j = k - 1; i < j; i++, j--) {
                int t = a[i];
                a[i] = a[j];
                a[j] = t;
            }
        }
        for (int i = 1; i < a.length; i++) {
            if (a[i - 1] > a[i]) return false;
        }
        return true;
    }
}
