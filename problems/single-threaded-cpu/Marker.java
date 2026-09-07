import java.util.*;

class Marker {
    public int[] getOrder(int[][] tasks) {
        int n = tasks.length;
        int[][] indexed = new int[n][3];
        for (int i = 0; i < n; i++) {
            indexed[i][0] = tasks[i][0];
            indexed[i][1] = tasks[i][1];
            indexed[i][2] = i;
        }
        Arrays.sort(indexed, Comparator.comparingInt(a -> a[0]));
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> {
            if (a[1] != b[1]) return Integer.compare(a[1], b[1]);
            return Integer.compare(a[2], b[2]);
        });
        int[] result = new int[n];
        int pos = 0, i = 0;
        long time = 0;
        while (pos < n) {
            if (heap.isEmpty() && time < indexed[i][0]) {
                time = indexed[i][0];
            }
            while (i < n && indexed[i][0] <= time) {
                heap.offer(indexed[i]);
                i++;
            }
            int[] cur = heap.poll();
            time += cur[1];
            result[pos++] = cur[2];
        }
        return result;
    }

    public boolean isCorrect(int[][] tasks, int[] output) {
        return Arrays.equals(getOrder(tasks), output);
    }
}
