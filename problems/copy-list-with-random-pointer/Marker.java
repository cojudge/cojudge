import java.util.Arrays;

class Marker {
    public int[][] copyRandomList(int[][] nodes) {
        if (nodes == null) return null;
        int[][] copy = new int[nodes.length][];
        for (int i = 0; i < nodes.length; i++) {
            copy[i] = Arrays.copyOf(nodes[i], nodes[i].length);
        }
        return copy;
    }

    public boolean isCorrect(int[][] nodes, int[][] output) {
        return output != null && Arrays.deepEquals(copyRandomList(nodes), output);
    }
}
