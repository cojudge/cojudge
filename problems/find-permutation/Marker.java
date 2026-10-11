import java.util.*;
class Marker {
    public int[] findPermutation(String s) {
        int n = s.length();
        int[] ans = new int[n + 1];
        for (int i = 0; i <= n; i++) ans[i] = i + 1;
        int i = 0;
        while (i < n) {
            if (s.charAt(i) == 'D') {
                int j = i;
                while (j < n && s.charAt(j) == 'D') j++;
                reverse(ans, i, j);
                i = j;
            } else {
                i++;
            }
        }
        return ans;
    }
    private void reverse(int[] a, int i, int j) {
        while (i < j) {
            int t = a[i]; a[i] = a[j]; a[j] = t;
            i++; j--;
        }
    }
    public boolean isCorrect(String s, int[] output) {
        return Arrays.equals(findPermutation(s), output);
    }
}
