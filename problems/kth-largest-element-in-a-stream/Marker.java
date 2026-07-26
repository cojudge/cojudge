import java.util.*;

class Marker {
    public int[] kthLargestStream(int k, int[] nums, int[] additions) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int value : nums) {
            heap.offer(value);
            if (heap.size() > k) heap.poll();
        }

        int[] result = new int[additions.length];
        for (int i = 0; i < additions.length; i++) {
            heap.offer(additions[i]);
            if (heap.size() > k) heap.poll();
            result[i] = heap.peek();
        }
        return result;
    }

    public boolean isCorrect(int k, int[] nums, int[] additions, int[] output) {
        return Arrays.equals(kthLargestStream(k, nums, additions), output);
    }
}
