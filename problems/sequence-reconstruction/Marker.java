import java.util.*;
class Marker {
    public boolean sequenceReconstruction(int[] nums, int[][] sequences) {
        int n = nums.length;
        Map<Integer, Set<Integer>> graph = new HashMap<>();
        Map<Integer, Integer> indeg = new HashMap<>();
        for (int x : nums) {
            graph.put(x, new HashSet<>());
            indeg.put(x, 0);
        }
        Set<Integer> seen = new HashSet<>();
        for (int[] seq : sequences) {
            for (int i = 0; i < seq.length; i++) {
                int v = seq[i];
                if (v < 1 || v > n) return false;
                seen.add(v);
                if (!graph.containsKey(v)) {
                    graph.put(v, new HashSet<>());
                    indeg.put(v, 0);
                }
                if (i > 0) {
                    int u = seq[i - 1];
                    if (u < 1 || u > n) return false;
                    if (graph.get(u).add(v)) {
                        indeg.put(v, indeg.get(v) + 1);
                    }
                }
            }
        }
        for (int x : nums) if (!seen.contains(x)) return false;
        Queue<Integer> q = new ArrayDeque<>();
        for (int x : nums) if (indeg.get(x) == 0) q.add(x);
        int idx = 0;
        while (!q.isEmpty()) {
            if (q.size() > 1) return false;
            int u = q.poll();
            if (idx >= n || nums[idx++] != u) return false;
            for (int v : graph.getOrDefault(u, Collections.emptySet())) {
                indeg.put(v, indeg.get(v) - 1);
                if (indeg.get(v) == 0) q.add(v);
            }
        }
        return idx == n;
    }
    public boolean isCorrect(int[] nums, int[][] sequences, boolean output) {
        return sequenceReconstruction(nums, sequences) == output;
    }
}
