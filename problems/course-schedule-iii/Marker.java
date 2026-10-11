import java.util.*;
class Marker {
    public int scheduleCourse(int[][] courses) {
        Arrays.sort(courses, (a, b) -> Integer.compare(a[1], b[1]));
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        int time = 0;
        for (int[] c : courses) {
            time += c[0];
            maxHeap.offer(c[0]);
            if (time > c[1]) time -= maxHeap.poll();
        }
        return maxHeap.size();
    }
    public boolean isCorrect(int[][] courses, int output) {
        return scheduleCourse(courses) == output;
    }
}
