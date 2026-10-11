import java.util.*;
class Marker {
    public int numBusesToDestination(int[][] routes, int source, int target) {
        if (source == target) return 0;
        Map<Integer, List<Integer>> stopToBuses = new HashMap<>();
        for (int b = 0; b < routes.length; b++)
            for (int s : routes[b])
                stopToBuses.computeIfAbsent(s, k -> new ArrayList<>()).add(b);
        if (!stopToBuses.containsKey(source) || !stopToBuses.containsKey(target)) {
            // still need buses containing source/target; if missing -> -1
            boolean hasS = stopToBuses.containsKey(source), hasT = stopToBuses.containsKey(target);
            if (!hasS || !hasT) return -1;
        }
        Queue<Integer> q = new ArrayDeque<>();
        boolean[] seenBus = new boolean[routes.length];
        Set<Integer> seenStop = new HashSet<>();
        q.add(source);
        seenStop.add(source);
        int buses = 0;
        while (!q.isEmpty()) {
            int sz = q.size();
            buses++;
            for (int i = 0; i < sz; i++) {
                int stop = q.poll();
                List<Integer> busesHere = stopToBuses.getOrDefault(stop, Collections.emptyList());
                for (int b : busesHere) {
                    if (seenBus[b]) continue;
                    seenBus[b] = true;
                    for (int ns : routes[b]) {
                        if (ns == target) return buses;
                        if (seenStop.add(ns)) q.add(ns);
                    }
                }
            }
        }
        return -1;
    }
    public boolean isCorrect(int[][] routes, int source, int target, int output) {
        return numBusesToDestination(routes, source, target) == output;
    }
}
