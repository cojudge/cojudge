import java.util.*;
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        MedianFinder mf = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("MedianFinder")) {
                mf = new MedianFinder();
                result.add("null");
            } else if (op.equals("addNum")) {
                mf.addNum(values[i][0]);
                result.add("null");
            } else if (op.equals("findMedian")) {
                double med = mf.findMedian();
                if (med == (long) med) {
                    result.add(String.valueOf((long) med) + ".0");
                } else {
                    result.add(String.valueOf(med));
                }
            }
        }
        return result;
    }
    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        List<String> expected = solve(operations, values);
        return expected.equals(output);
    }
    class MedianFinder {
        PriorityQueue<Integer> small = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Integer> large = new PriorityQueue<>();
        public void addNum(int num) {
            small.offer(num);
            large.offer(small.poll());
            if (small.size() < large.size()) {
                small.offer(large.poll());
            }
        }
        public double findMedian() {
            if (small.size() > large.size()) return small.peek();
            return (small.peek() + large.peek()) / 2.0;
        }
    }
}
