import java.util.*;
class Marker {
    public int[] advantageCount(int[] nums1, int[] nums2) {
        int n = nums1.length;
        int[] sorted1 = nums1.clone();
        Arrays.sort(sorted1);
        Integer[] idx = new Integer[n];
        for (int i = 0; i < n; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Integer.compare(nums2[a], nums2[b]));
        int[] ans = new int[n];
        Deque<Integer> dq = new ArrayDeque<>();
        for (int v : sorted1) dq.offer(v);
        // store smallest that beats logic via two pointers
        int lo = 0, hi = n - 1;
        // use sorted list and assign from largest opponent downwards is easier:
        // implement standard greedy with TreeMap multiset
        TreeMap<Integer, Integer> cnt = new TreeMap<>();
        for (int v : nums1) cnt.put(v, cnt.getOrDefault(v, 0) + 1);
        for (int k = n - 1; k >= 0; k--) {
            int opp = nums2[idx[k]];
            Integer key = cnt.higherKey(opp);
            int pick;
            if (key != null) pick = key;
            else pick = cnt.firstKey();
            ans[idx[k]] = pick;
            int c = cnt.get(pick);
            if (c == 1) cnt.remove(pick); else cnt.put(pick, c - 1);
        }
        return ans;
    }
    private int advantage(int[] a, int[] b) {
        int c = 0;
        for (int i = 0; i < a.length; i++) if (a[i] > b[i]) c++;
        return c;
    }
    public boolean isCorrect(int[] nums1, int[] nums2, int[] output) {
        if (output == null || output.length != nums1.length) return false;
        int[] s1 = nums1.clone(), s2 = output.clone();
        Arrays.sort(s1); Arrays.sort(s2);
        if (!Arrays.equals(s1, s2)) return false;
        int got = advantage(output, nums2);
        int best = advantage(advantageCount(nums1, nums2), nums2);
        return got == best;
    }
}
