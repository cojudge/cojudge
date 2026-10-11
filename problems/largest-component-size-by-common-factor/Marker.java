import java.util.*;
class Marker {
    public int largestComponentSize(int[] nums) {
        int n = nums.length;
        int[] parent = new int[n];
        int[] size = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
        Map<Integer, Integer> first = new HashMap<>();
        for (int i = 0; i < n; i++) {
            for (int p : primeFactors(nums[i])) {
                Integer j = first.get(p);
                if (j == null) {
                    first.put(p, i);
                } else {
                    union(parent, size, i, j);
                }
            }
        }
        int best = 0;
        for (int s : size) {
            if (s > best) {
                best = s;
            }
        }
        return best;
    }
    private List<Integer> primeFactors(int x) {
        List<Integer> res = new ArrayList<>();
        int v = x;
        for (int p = 2; p * p <= v; p++) {
            if (v % p == 0) {
                res.add(p);
                while (v % p == 0) {
                    v /= p;
                }
            }
        }
        if (v > 1) {
            res.add(v);
        }
        return res;
    }
    private int find(int[] parent, int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
    private void union(int[] parent, int[] size, int a, int b) {
        int ra = find(parent, a);
        int rb = find(parent, b);
        if (ra == rb) return;
        if (size[ra] < size[rb]) {
            int t = ra;
            ra = rb;
            rb = t;
        }
        parent[rb] = ra;
        size[ra] += size[rb];
    }
    public boolean isCorrect(int[] nums, int output) {
        return largestComponentSize(nums) == output;
    }
}
