import java.util.*;
class Marker {
    public int[][] fourSum(int[] nums, int target) {
        List<int[]> res = new ArrayList<>();
        if (nums == null || nums.length < 4) return new int[][]{};
        int[] a = nums.clone();
        Arrays.sort(a);
        int n = a.length;
        for (int i = 0; i < n - 3; i++) {
            if (i > 0 && a[i] == a[i - 1]) continue;
            for (int j = i + 1; j < n - 2; j++) {
                if (j > i + 1 && a[j] == a[j - 1]) continue;
                int l = j + 1, r = n - 1;
                while (l < r) {
                    long s = (long) a[i] + a[j] + a[l] + a[r];
                    if (s == target) {
                        res.add(new int[]{a[i], a[j], a[l], a[r]});
                        int lv = a[l], rv = a[r];
                        while (l < r && a[l] == lv) l++;
                        while (l < r && a[r] == rv) r--;
                    } else if (s < target) {
                        l++;
                    } else {
                        r--;
                    }
                }
            }
        }
        int[][] out = new int[res.size()][];
        for (int i = 0; i < res.size(); i++) out[i] = res.get(i);
        return out;
    }

    public boolean isCorrect(int[] nums, int target, int[][] output) {
        int[][] expected = fourSum(nums, target);
        return sameQuadSets(expected, output);
    }

    private boolean sameQuadSets(int[][] a, int[][] b) {
        List<List<Integer>> ca = canonicalize(a);
        List<List<Integer>> cb = canonicalize(b);
        if (ca.size() != cb.size()) return false;
        for (int i = 0; i < ca.size(); i++) {
            List<Integer> x = ca.get(i), y = cb.get(i);
            for (int j = 0; j < 4; j++) if (!Objects.equals(x.get(j), y.get(j))) return false;
        }
        return true;
    }

    private List<List<Integer>> canonicalize(int[][] arr) {
        List<List<Integer>> list = new ArrayList<>();
        if (arr == null) return list;
        for (int[] t : arr) {
            if (t == null || t.length != 4) continue;
            int[] c = t.clone();
            Arrays.sort(c);
            list.add(Arrays.asList(c[0], c[1], c[2], c[3]));
        }
        list.sort((u, v) -> {
            for (int i = 0; i < 4; i++) {
                int cmp = Integer.compare(u.get(i), v.get(i));
                if (cmp != 0) return cmp;
            }
            return 0;
        });
        return list;
    }
}
