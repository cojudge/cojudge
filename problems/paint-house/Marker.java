class Marker {
    public int minCost(int[][] costs) {
        int r = 0, b = 0, g = 0;
        for (int[] c : costs) {
            int nr = c[0] + Math.min(b, g);
            int nb = c[1] + Math.min(r, g);
            int ng = c[2] + Math.min(r, b);
            r = nr;
            b = nb;
            g = ng;
        }
        return Math.min(r, Math.min(b, g));
    }
    public boolean isCorrect(int[][] costs, int output) {
        return minCost(costs) == output;
    }
}
