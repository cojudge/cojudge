import java.util.*;
class Marker {
    public GraphNode cloneGraph(GraphNode node) {
        if (node == null) return null;
        Map<GraphNode, GraphNode> map = new HashMap<>();
        Queue<GraphNode> q = new LinkedList<>();
        q.add(node);
        map.put(node, new GraphNode(node.val));
        while (!q.isEmpty()) {
            GraphNode cur = q.poll();
            for (GraphNode neighbor : cur.neighbors) {
                if (!map.containsKey(neighbor)) {
                    map.put(neighbor, new GraphNode(neighbor.val));
                    q.add(neighbor);
                }
                map.get(cur).neighbors.add(map.get(neighbor));
            }
        }
        return map.get(node);
    }

    public boolean isCorrect(GraphNode node, GraphNode output) {
        if (node == null) return output == null;
        if (node == output) return false;
        if (!sharesNoNodes(node, output)) return false;
        GraphNode expected = cloneGraph(node);
        return adjListEquals(getAdjList(expected), getAdjList(output));
    }

    private boolean sharesNoNodes(GraphNode a, GraphNode b) {
        Set<GraphNode> visitedA = new HashSet<>();
        Queue<GraphNode> q = new LinkedList<>();
        q.add(a);
        visitedA.add(a);
        while (!q.isEmpty()) {
            GraphNode cur = q.poll();
            for (GraphNode n : cur.neighbors) {
                if (!visitedA.contains(n)) {
                    visitedA.add(n);
                    q.add(n);
                }
            }
        }
        Set<GraphNode> visitedB = new HashSet<>();
        q.add(b);
        visitedB.add(b);
        while (!q.isEmpty()) {
            GraphNode cur = q.poll();
            if (visitedA.contains(cur)) return false;
            for (GraphNode n : cur.neighbors) {
                if (!visitedB.contains(n)) {
                    visitedB.add(n);
                    q.add(n);
                }
            }
        }
        return true;
    }

    private Map<Integer, List<Integer>> getAdjList(GraphNode start) {
        Map<Integer, List<Integer>> adj = new LinkedHashMap<>();
        Set<GraphNode> visited = new HashSet<>();
        Queue<GraphNode> q = new LinkedList<>();
        q.add(start);
        visited.add(start);
        while (!q.isEmpty()) {
            GraphNode cur = q.poll();
            List<Integer> neighbors = new ArrayList<>();
            for (GraphNode n : cur.neighbors) {
                neighbors.add(n.val);
                if (!visited.contains(n)) {
                    visited.add(n);
                    q.add(n);
                }
            }
            adj.put(cur.val, neighbors);
        }
        return adj;
    }

    private boolean adjListEquals(Map<Integer, List<Integer>> a, Map<Integer, List<Integer>> b) {
        if (a.size() != b.size()) return false;
        for (int key : a.keySet()) {
            if (!b.containsKey(key)) return false;
            List<Integer> la = a.get(key);
            List<Integer> lb = b.get(key);
            Collections.sort(la);
            Collections.sort(lb);
            if (!la.equals(lb)) return false;
        }
        return true;
    }
}
