import java.util.*;
class Marker {
    public int reachableNodes(int[][] edges, int maxMoves, int n) {
        List<List<int[]>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<int[]>());
        for (int[] e : edges) {
            g.get(e[0]).add(new int[]{e[1], e[2]});
            g.get(e[1]).add(new int[]{e[0], e[2]});
        }
        long[] dist = new long[n];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[0] = 0;
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
        pq.offer(new long[]{0, 0});
        while (!pq.isEmpty()) {
            long[] cur = pq.poll();
            long d = cur[0];
            int u = (int) cur[1];
            if (d != dist[u]) continue;
            for (int[] nb : g.get(u)) {
                int v = nb[0];
                long w = (long) nb[1] + 1;
                if (dist[v] > d + w) {
                    dist[v] = d + w;
                    pq.offer(new long[]{dist[v], v});
                }
            }
        }
        int ans = 0;
        for (int i = 0; i < n; i++) if (dist[i] <= maxMoves) ans++;
        for (int[] e : edges) {
            long leftU = dist[e[0]] > maxMoves ? 0 : maxMoves - dist[e[0]];
            long leftV = dist[e[1]] > maxMoves ? 0 : maxMoves - dist[e[1]];
            ans += (int) Math.min((long) e[2], leftU + leftV);
        }
        return ans;
    }
    public boolean isCorrect(int[][] edges, int maxMoves, int n, int output) {
        return reachableNodes(edges, maxMoves, n) == output;
    }
}
