import java.util.*;
class Marker {
    public int[][] kSmallestPairs(int[] nums1, int[] nums2, int k) {
        int n = nums1.length, m = nums2.length;
        int want = Math.min(k, n * m);
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) ->
            Integer.compare(nums1[a[0]] + nums2[a[1]], nums1[b[0]] + nums2[b[1]]));
        Set<Long> seen = new HashSet<>();
        pq.offer(new int[]{0, 0});
        seen.add(0L);
        List<int[]> out = new ArrayList<>();
        while (out.size() < want && !pq.isEmpty()) {
            int[] cur = pq.poll();
            int i = cur[0], j = cur[1];
            out.add(new int[]{nums1[i], nums2[j]});
            if (i + 1 < n) {
                long key = ((long)(i + 1) << 32) | (j & 0xffffffffL);
                if (seen.add(key)) pq.offer(new int[]{i + 1, j});
            }
            if (j + 1 < m) {
                long key = ((long)i << 32) | ((j + 1) & 0xffffffffL);
                if (seen.add(key)) pq.offer(new int[]{i, j + 1});
            }
        }
        return out.toArray(new int[out.size()][]);
    }
    public boolean isCorrect(int[] nums1, int[] nums2, int k, int[][] output) {
        if (output == null) return false;
        int want = Math.min(k, nums1.length * nums2.length);
        if (output.length != want) return false;
        Set<Integer> s1 = new HashSet<>();
        for (int v : nums1) s1.add(v);
        Set<Integer> s2 = new HashSet<>();
        for (int v : nums2) s2.add(v);
        // Handle duplicates via counts: each value must appear in inputs
        Map<Integer,Integer> c1 = new HashMap<>();
        for (int v : nums1) c1.put(v, c1.getOrDefault(v, 0) + 1);
        Map<Integer,Integer> c2 = new HashMap<>();
        for (int v : nums2) c2.put(v, c2.getOrDefault(v, 0) + 1);
        List<Integer> gotSums = new ArrayList<>();
        for (int[] p : output) {
            if (p == null || p.length != 2) return false;
            if (!c1.containsKey(p[0]) || !c2.containsKey(p[1])) return false;
            gotSums.add(p[0] + p[1]);
        }
        int[][] exp = kSmallestPairs(nums1, nums2, k);
        List<Integer> expSums = new ArrayList<>();
        for (int[] p : exp) expSums.add(p[0] + p[1]);
        Collections.sort(gotSums);
        Collections.sort(expSums);
        return gotSums.equals(expSums);
    }
}
