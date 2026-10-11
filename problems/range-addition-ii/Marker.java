class Marker {
    public int maxCount(int m, int n, int[][] ops) {
        if (ops == null || ops.length == 0) return m * n;
        int a = Integer.MAX_VALUE, b = Integer.MAX_VALUE;
        for (int[] o : ops) { a = Math.min(a, o[0]); b = Math.min(b, o[1]); }
        return a * b;
    }
    public boolean isCorrect(int m, int n, int[][] ops, int output) {
        return output == maxCount(m, n, ops);
    }
}
