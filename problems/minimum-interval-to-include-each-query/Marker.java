import java.util.*;

class Marker {
    public int[] minInterval(int[][] intervals, int[] queries) {
        int[][] sortedIntervals = new int[intervals.length][];
        for (int i = 0; i < intervals.length; i++) {
            sortedIntervals[i] = intervals[i].clone();
        }
        Arrays.sort(sortedIntervals, (a, b) -> Integer.compare(a[0], b[0]));

        Integer[] queryOrder = new Integer[queries.length];
        for (int i = 0; i < queries.length; i++) queryOrder[i] = i;
        Arrays.sort(queryOrder, (a, b) -> Integer.compare(queries[a], queries[b]));

        PriorityQueue<long[]> active = new PriorityQueue<>((a, b) -> {
            int bySize = Long.compare(a[0], b[0]);
            return bySize != 0 ? bySize : Long.compare(a[1], b[1]);
        });
        int[] answer = new int[queries.length];
        Arrays.fill(answer, -1);
        int intervalIndex = 0;

        for (int queryIndex : queryOrder) {
            int query = queries[queryIndex];
            while (intervalIndex < sortedIntervals.length
                    && sortedIntervals[intervalIndex][0] <= query) {
                int left = sortedIntervals[intervalIndex][0];
                int right = sortedIntervals[intervalIndex][1];
                active.offer(new long[]{(long) right - left + 1, right});
                intervalIndex++;
            }
            while (!active.isEmpty() && active.peek()[1] < query) {
                active.poll();
            }
            if (!active.isEmpty()) answer[queryIndex] = (int) active.peek()[0];
        }
        return answer;
    }

    public boolean isCorrect(int[][] intervals, int[] queries, int[] output) {
        return Arrays.equals(minInterval(intervals, queries), output);
    }
}
