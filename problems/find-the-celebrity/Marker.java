class Marker {
    public int findCelebrity(int[][] graph) {
        int n = graph.length;
        if (n == 0) return -1;
        int cand = 0;
        for (int i = 1; i < n; i++) {
            if (graph[cand][i] == 1) cand = i;
        }
        for (int i = 0; i < n; i++) {
            if (i == cand) continue;
            if (graph[cand][i] == 1) return -1;
            if (graph[i][cand] == 0) return -1;
        }
        return cand;
    }
    public boolean isCorrect(int[][] graph, int output) {
        return output == findCelebrity(graph);
    }
}
