import java.util.*;

class Marker {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        long infinity = Long.MAX_VALUE / 4;
        long[] cost = new long[n];
        Arrays.fill(cost, infinity);
        cost[src] = 0;

        for (int edgesUsed = 0; edgesUsed <= k; edgesUsed++) {
            long[] next = cost.clone();
            for (int[] flight : flights) {
                if (cost[flight[0]] != infinity) {
                    next[flight[1]] = Math.min(next[flight[1]], cost[flight[0]] + flight[2]);
                }
            }
            cost = next;
        }
        return cost[dst] == infinity ? -1 : (int) cost[dst];
    }

    public boolean isCorrect(int n, int[][] flights, int src, int dst, int k, int output) {
        return findCheapestPrice(n, flights, src, dst, k) == output;
    }
}
