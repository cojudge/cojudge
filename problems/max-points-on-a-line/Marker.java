class Marker {
    public int maxPoints(int[][] points) {
        int n = points.length;
        if (n <= 2) return n;
        int best = 0;
        for (int i = 0; i < n; i++) {
            java.util.Map<String, Integer> cnt = new java.util.HashMap<>();
            int sameX = 0;
            int curBest = 0;
            for (int j = i + 1; j < n; j++) {
                int dx = points[j][0] - points[i][0];
                int dy = points[j][1] - points[i][1];
                if (dx == 0 && dy == 0) continue;
                String key;
                if (dx == 0) key = "v";
                else if (dy == 0) key = "h";
                else {
                    int g = gcd(Math.abs(dx), Math.abs(dy));
                    dx /= g; dy /= g;
                    if (dx < 0) { dx = -dx; dy = -dy; }
                    key = dx + "," + dy;
                }
                int c = cnt.getOrDefault(key, 0) + 1;
                cnt.put(key, c);
                curBest = Math.max(curBest, c);
            }
            best = Math.max(best, curBest + 1);
        }
        return best;
    }
    private int gcd(int a, int b) {
        while (b != 0) { int t = a % b; a = b; b = t; }
        return a;
    }
    public boolean isCorrect(int[][] points, int output) {
        return maxPoints(points) == output;
    }
}
