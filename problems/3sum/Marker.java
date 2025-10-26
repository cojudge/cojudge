import java.util.*;
class Marker {
    // Returns all unique triplets that sum to zero as an array of arrays
    public int[][] threeSum(int[] nums) {
        List<int[]> res = new ArrayList<>();
        if (nums == null || nums.length < 3) return new int[][]{};
        Arrays.sort(nums);
        int n = nums.length;
        for (int i = 0; i < n - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue; // skip dup i
            int l = i + 1, r = n - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s == 0) {
                    res.add(new int[]{nums[i], nums[l], nums[r]});
                    int lv = nums[l], rv = nums[r];
                    while (l < r && nums[l] == lv) l++;
                    while (l < r && nums[r] == rv) r--;
                } else if (s < 0) {
                    l++;
                } else {
                    r--;
                }
            }
        }
        int[][] out = new int[res.size()][];
        for (int i = 0; i < res.size(); i++) out[i] = res.get(i);
        return out;
    }

    // Compare ignoring ordering of triplets and elements within triplets.
    public boolean isCorrect(int[] nums, int[][] output) {
        int[][] expected = threeSum(nums);
        return sameTripletSets(expected, output);
    }

    private boolean sameTripletSets(int[][] a, int[][] b) {
        List<List<Integer>> ca = canonicalize(a);
        List<List<Integer>> cb = canonicalize(b);
        if (ca.size() != cb.size()) return false;
        for (int i = 0; i < ca.size(); i++) {
            List<Integer> x = ca.get(i), y = cb.get(i);
            for (int j = 0; j < 3; j++) if (!Objects.equals(x.get(j), y.get(j))) return false;
        }
        return true;
    }

    private List<List<Integer>> canonicalize(int[][] arr) {
        List<List<Integer>> list = new ArrayList<>();
        if (arr == null) return list;
        for (int[] t : arr) {
            if (t == null || t.length != 3) continue;
            int[] c = t.clone();
            Arrays.sort(c);
            list.add(Arrays.asList(c[0], c[1], c[2]));
        }
        list.sort((u, v) -> {
            for (int i = 0; i < 3; i++) {
                int cmp = Integer.compare(u.get(i), v.get(i));
                if (cmp != 0) return cmp;
            }
            return 0;
        });
        return list;
    }
}
