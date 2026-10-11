import java.util.*;
class Marker {
    public List<String> medianSlidingWindow(int[] nums, int k) {
        DualHeap dh = new DualHeap(k);
        List<String> out = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            dh.add(nums[i]);
            if (i >= k) dh.remove(nums[i - k]);
            if (i >= k - 1) out.add(Double.toString(dh.median()));
        }
        return out;
    }
    public boolean isCorrect(int[] nums, int k, List<String> output) {
        List<String> expected = medianSlidingWindow(nums, k);
        if (output == null || output.size() != expected.size()) return false;
        for (int i = 0; i < expected.size(); i++) {
            try {
                double e = Double.parseDouble(expected.get(i));
                double a = Double.parseDouble(output.get(i));
                if (!Double.isFinite(a)) return false;
                double tol = 1e-5 + 1e-5 * Math.abs(e);
                if (Math.abs(e - a) > tol) return false;
            } catch (Exception ex) { return false; }
        }
        return true;
    }
    static class DualHeap {
        PriorityQueue<Integer> small = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Integer> large = new PriorityQueue<>();
        Map<Integer, Integer> delayed = new HashMap<>();
        int smallSize = 0, largeSize = 0;
        int k;
        DualHeap(int k) { this.k = k; }
        private void prune(PriorityQueue<Integer> h) {
            while (!h.isEmpty()) {
                int v = h.peek();
                Integer c = delayed.get(v);
                if (c == null) break;
                if (c == 1) delayed.remove(v);
                else delayed.put(v, c - 1);
                h.poll();
            }
        }
        private void balance() {
            if (smallSize > largeSize + 1) {
                large.offer(small.poll());
                smallSize--; largeSize++;
                prune(small);
            } else if (smallSize < largeSize) {
                small.offer(large.poll());
                smallSize++; largeSize--;
                prune(large);
            }
        }
        void add(int v) {
            if (small.isEmpty() || v <= small.peek()) {
                small.offer(v); smallSize++;
            } else {
                large.offer(v); largeSize++;
            }
            balance();
        }
        void remove(int v) {
            delayed.put(v, delayed.getOrDefault(v, 0) + 1);
            if (!small.isEmpty() && v <= small.peek()) {
                smallSize--;
                if (v == small.peek()) prune(small);
            } else {
                largeSize--;
                if (!large.isEmpty() && v == large.peek()) prune(large);
            }
            balance();
        }
        double median() {
            if ((k & 1) == 1) return (double) small.peek();
            return ((double) small.peek() + (double) large.peek()) / 2.0;
        }
    }
}
