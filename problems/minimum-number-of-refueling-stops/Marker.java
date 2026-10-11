import java.util.*;
class Marker {
    public int minRefuelStops(int target, int startFuel, int[][] stations) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        int stops = 0, i = 0, fuel = startFuel;
        while (fuel < target) {
            while (i < stations.length && stations[i][0] <= fuel) {
                pq.offer(stations[i][1]);
                i++;
            }
            if (pq.isEmpty()) return -1;
            fuel += pq.poll();
            stops++;
        }
        return stops;
    }
    public boolean isCorrect(int target, int startFuel, int[][] stations, int output) {
        return minRefuelStops(target, startFuel, stations) == output;
    }
}
