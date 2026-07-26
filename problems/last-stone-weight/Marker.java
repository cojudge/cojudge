import java.util.*;

class Marker {
    public int lastStoneWeight(int[] stones) {
        PriorityQueue<Integer> heap = new PriorityQueue<>(Comparator.reverseOrder());
        for (int stone : stones) heap.offer(stone);

        while (heap.size() > 1) {
            int heaviest = heap.poll();
            int second = heap.poll();
            if (heaviest != second) heap.offer(heaviest - second);
        }
        return heap.isEmpty() ? 0 : heap.peek();
    }

    public boolean isCorrect(int[] stones, int output) {
        return lastStoneWeight(stones) == output;
    }
}
