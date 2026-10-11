import java.util.*;
class Marker {
    static class Node {
        boolean isInt;
        int val;
        List<Node> list = new ArrayList<>();
    }
    public int depthSumInverse(String nestedList) {
        if (nestedList == null || nestedList.isEmpty()) return 0;
        int[] pos = new int[]{0};
        Node root = parse(nestedList, pos);
        int maxD = maxDepth(root, 0);
        return weighted(root, 0, maxD);
    }
    private Node parse(String s, int[] pos) {
        if (s.charAt(pos[0]) == '[') {
            Node n = new Node();
            n.isInt = false;
            pos[0]++;
            while (s.charAt(pos[0]) != ']') {
                if (s.charAt(pos[0]) == ',') { pos[0]++; continue; }
                n.list.add(parse(s, pos));
            }
            pos[0]++;
            return n;
        }
        int j = pos[0];
        if (s.charAt(j) == '-') j++;
        while (j < s.length() && Character.isDigit(s.charAt(j))) j++;
        Node n = new Node();
        n.isInt = true;
        n.val = Integer.parseInt(s.substring(pos[0], j));
        pos[0] = j;
        return n;
    }
    private int maxDepth(Node n, int d) {
        return maxDepthFixed(n, d);
    }
    private int maxDepthFixed(Node n, int d) {
        if (n.isInt) return d;
        int best = d;
        for (Node c : n.list) best = Math.max(best, maxDepthFixed(c, d + 1));
        return best;
    }
    private int weighted(Node n, int d, int maxD) {
        if (n.isInt) return n.val * (maxD - d + 1);
        int s = 0;
        for (Node c : n.list) s += weightedFixed(c, d + 1, maxD);
        return s;
    }
    private int weightedFixed(Node n, int d, int maxD) {
        if (n.isInt) return n.val * (maxD - d + 1);
        int s = 0;
        for (Node c : n.list) s += weightedFixed(c, d + 1, maxD);
        return s;
    }
    public boolean isCorrect(String nestedList, int output) {
        return depthSumInverse(nestedList) == output;
    }
}
