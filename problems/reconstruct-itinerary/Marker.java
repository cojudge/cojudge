import java.util.*;

class Marker {
    public List<String> findItinerary(String[] from, String[] to) {
        Map<String, PriorityQueue<String>> graph = new HashMap<>();
        for (int i = 0; i < from.length; i++) {
            graph.computeIfAbsent(from[i], key -> new PriorityQueue<>()).add(to[i]);
        }
        LinkedList<String> itinerary = new LinkedList<>();
        visit("JFK", graph, itinerary);
        return itinerary;
    }

    private void visit(String airport, Map<String, PriorityQueue<String>> graph,
                       LinkedList<String> itinerary) {
        PriorityQueue<String> destinations = graph.get(airport);
        while (destinations != null && !destinations.isEmpty()) {
            visit(destinations.remove(), graph, itinerary);
        }
        itinerary.addFirst(airport);
    }

    public boolean isCorrect(String[] from, String[] to, List<String> output) {
        return output != null && findItinerary(from, to).equals(output);
    }
}
