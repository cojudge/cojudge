import java.util.*;

class Marker {
    public int[][] kClosest(int[][] points, int k) {
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> {
            int byDistance = Long.compare(distance(b), distance(a));
            if (byDistance != 0) return byDistance;
            int byX = Integer.compare(b[0], a[0]);
            return byX != 0 ? byX : Integer.compare(b[1], a[1]);
        });

        for (int[] point : points) {
            heap.offer(point.clone());
            if (heap.size() > k) heap.poll();
        }

        int[][] result = new int[k][2];
        for (int i = 0; i < k; i++) result[i] = heap.poll();
        return result;
    }

    public boolean isCorrect(int[][] points, int k, int[][] output) {
        if (output == null || output.length != k) return false;

        long threshold = kthDistance(points, k);
        Map<Long, Integer> available = new HashMap<>();
        Map<Long, Integer> required = new HashMap<>();
        for (int[] point : points) {
            long key = coordinateKey(point[0], point[1]);
            available.put(key, available.getOrDefault(key, 0) + 1);
            if (distance(point) < threshold) {
                required.put(key, required.getOrDefault(key, 0) + 1);
            }
        }

        for (int[] point : output) {
            if (point == null || point.length != 2) return false;
            long key = coordinateKey(point[0], point[1]);
            int count = available.getOrDefault(key, 0);
            if (count == 0 || distance(point) > threshold) return false;
            available.put(key, count - 1);

            if (distance(point) < threshold) {
                int needed = required.getOrDefault(key, 0);
                if (needed == 0) return false;
                required.put(key, needed - 1);
            }
        }

        for (int count : required.values()) {
            if (count != 0) return false;
        }
        return true;
    }

    private long kthDistance(int[][] points, int k) {
        PriorityQueue<Long> heap = new PriorityQueue<>(Comparator.reverseOrder());
        for (int[] point : points) {
            heap.offer(distance(point));
            if (heap.size() > k) heap.poll();
        }
        return heap.peek();
    }

    private static long distance(int[] point) {
        return (long) point[0] * point[0] + (long) point[1] * point[1];
    }

    private long coordinateKey(int x, int y) {
        return ((long) x << 32) ^ (y & 0xffffffffL);
    }
}
