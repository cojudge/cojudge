import java.util.*;
class Marker {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            pq.offer(new int[]{e.getKey(), e.getValue()});
            if (pq.size() > k) pq.poll();
        }
        int size = Math.min(k, pq.size());
        int[] res = new int[size];
        int i = 0;
        while (!pq.isEmpty()) res[i++] = pq.poll()[0];
        return res;
    }

    public boolean isCorrect(int[] nums, int k, int[] output) {
        if (output == null) return false;
        if (k < 0) return false;
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
        if (output.length != k) return false;
        Set<Integer> seen = new HashSet<>();
        int minFreqSelected = Integer.MAX_VALUE;
        for (int x : output) {
            if (!freq.containsKey(x)) return false;
            if (!seen.add(x)) return false; // duplicates in output not allowed
            minFreqSelected = Math.min(minFreqSelected, freq.get(x));
        }
        int maxFreqNotSelected = 0;
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            if (!seen.contains(e.getKey())) maxFreqNotSelected = Math.max(maxFreqNotSelected, e.getValue());
        }
        return maxFreqNotSelected <= minFreqSelected;
    }
}
