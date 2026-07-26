import java.util.*;

class Marker {
    public int networkDelayTime(int[][] times, int n, int k) {
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i <= n; i++) graph.add(new ArrayList<>());
        for (int[] edge : times) graph.get(edge[0]).add(new int[]{edge[1], edge[2]});

        int[] distance = new int[n + 1];
        Arrays.fill(distance, Integer.MAX_VALUE);
        distance[k] = 0;
        PriorityQueue<int[]> queue = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        queue.add(new int[]{0, k});

        while (!queue.isEmpty()) {
            int[] current = queue.remove();
            int elapsed = current[0];
            int node = current[1];
            if (elapsed != distance[node]) continue;
            for (int[] edge : graph.get(node)) {
                int nextDistance = elapsed + edge[1];
                if (nextDistance < distance[edge[0]]) {
                    distance[edge[0]] = nextDistance;
                    queue.add(new int[]{nextDistance, edge[0]});
                }
            }
        }

        int answer = 0;
        for (int node = 1; node <= n; node++) {
            if (distance[node] == Integer.MAX_VALUE) return -1;
            answer = Math.max(answer, distance[node]);
        }
        return answer;
    }

    public boolean isCorrect(int[][] times, int n, int k, int output) {
        return networkDelayTime(times, n, k) == output;
    }
}
