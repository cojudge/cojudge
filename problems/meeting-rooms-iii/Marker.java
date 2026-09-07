import java.util.*;
class Marker {
    public int mostBooked(int n, int[][] meetings) {
        Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]));
        long[] freeAt = new long[n];
        int[] count = new int[n];
        PriorityQueue<Integer> free = new PriorityQueue<>();
        for (int i = 0; i < n; i++) free.offer(i);
        // busy: [endTime, room]
        PriorityQueue<long[]> busy = new PriorityQueue<>((a, b) -> a[0] != b[0] ? Long.compare(a[0], b[0]) : Long.compare(a[1], b[1]));
        for (int[] m : meetings) {
            long start = m[0], end = m[1];
            while (!busy.isEmpty() && busy.peek()[0] <= start) {
                free.offer((int) busy.poll()[1]);
            }
            int room;
            long actualStart;
            if (!free.isEmpty()) {
                room = free.poll();
                actualStart = start;
            } else {
                long[] b = busy.poll();
                room = (int) b[1];
                actualStart = b[0];
            }
            long duration = end - start;
            long finish = actualStart + duration;
            freeAt[room] = finish;
            busy.offer(new long[]{finish, room});
            count[room]++;
        }
        int best = 0;
        for (int i = 1; i < n; i++) if (count[i] > count[best]) best = i;
        return best;
    }
    public boolean isCorrect(int n, int[][] meetings, int output) {
        return mostBooked(n, meetings) == output;
    }
}
