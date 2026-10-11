import java.util.*;
class Marker {
    public int[] threeEqualParts(int[] arr) {
        int n = arr.length;
        int total = 0;
        for (int v : arr) total += v;
        if (total == 0) return new int[]{0, n - 1};
        if (total % 3 != 0) return new int[]{-1, -1};
        int k = total / 3;
        int i1 = -1, i2 = -1, i3 = -1, cnt = 0;
        for (int i = 0; i < n; i++) {
            if (arr[i] == 1) {
                cnt++;
                if (cnt == 1) i1 = i;
                else if (cnt == k + 1) i2 = i;
                else if (cnt == 2 * k + 1) i3 = i;
            }
        }
        int len = n - i3;
        for (int t = 0; t < len; t++) {
            if (i1 + t >= n || i2 + t >= n) return new int[]{-1, -1};
            if (arr[i1 + t] != arr[i2 + t] || arr[i2 + t] != arr[i3 + t]) return new int[]{-1, -1};
        }
        int endFirst = i1 + len - 1;
        int startThird = i2 + len;
        if (endFirst + 1 >= startThird || startThird >= n) return new int[]{-1, -1};
        return new int[]{endFirst, startThird};
    }
    private int[] strip(int[] a, int l, int r) {
        while (l <= r && a[l] == 0) l++;
        if (l > r) return new int[0];
        return Arrays.copyOfRange(a, l, r + 1);
    }
    public boolean isCorrect(int[] arr, int[] output) {
        int[] exp = threeEqualParts(arr.clone());
        if (output == null || output.length != 2) return false;
        if (exp[0] == -1) return output[0] == -1 && output[1] == -1;
        if (output[0] == -1) return false;
        int i = output[0], j = output[1];
        int n = arr.length;
        if (i < 0 || j < 0 || i >= n || j >= n || i + 1 >= j) return false;
        int[] p1 = strip(arr, 0, i);
        int[] p2 = strip(arr, i + 1, j - 1);
        int[] p3 = strip(arr, j, n - 1);
        return Arrays.equals(p1, p2) && Arrays.equals(p2, p3);
    }
}
