import java.util.*;
class Marker {
    public boolean canTraverseAllPairs(int[] nums) {
        int n = nums.length;
        if (n == 1) return true;
        int max = 0;
        for (int x : nums) {
            if (x == 1) return false;
            max = Math.max(max, x);
        }
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int[] first = new int[max + 1];
        Arrays.fill(first, -1);
        for (int i = 0; i < n; i++) {
            int x = nums[i];
            for (int p = 2; p * p <= x; p++) {
                if (x % p == 0) {
                    if (first[p] == -1) first[p] = i;
                    else union(parent, first[p], i);
                    while (x % p == 0) x /= p;
                }
            }
            if (x > 1) {
                if (first[x] == -1) first[x] = i;
                else union(parent, first[x], i);
            }
        }
        int root = find(parent, 0);
        for (int i = 1; i < n; i++) if (find(parent, i) != root) return false;
        return true;
    }
    private int find(int[] p, int x) {
        return p[x] == x ? x : (p[x] = find(p, p[x]));
    }
    private void union(int[] p, int a, int b) {
        a = find(p, a); b = find(p, b);
        if (a != b) p[a] = b;
    }
    public boolean isCorrect(int[] nums, boolean output) {
        return canTraverseAllPairs(nums) == output;
    }
}
