import java.util.*;

class Marker {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int value : nums) {
            heap.offer(value);
            if (heap.size() > k) heap.poll();
        }
        return heap.peek();
    }

    public boolean isCorrect(int[] nums, int k, int output) {
        return findKthLargest(nums, k) == output;
    }
}
