class Marker {
    public boolean isSelfCrossing(int[] d) {
        int n = d.length;
        for (int i = 3; i < n; i++) {
            if (d[i] >= d[i - 2] && d[i - 1] <= d[i - 3]) return true;
            if (i >= 4 && d[i - 1] == d[i - 3] && d[i] + d[i - 4] >= d[i - 2]) return true;
            if (i >= 5 && d[i - 2] >= d[i - 4]
                    && d[i] + d[i - 4] >= d[i - 2]
                    && d[i - 1] + d[i - 5] >= d[i - 3]
                    && d[i - 1] <= d[i - 3]
                    && d[i - 3] <= d[i - 1] + d[i - 5]
                    && d[i - 2] <= d[i] + d[i - 4]) return true;
        }
        return false;
    }
    public boolean isCorrect(int[] distance, boolean output) {
        return isSelfCrossing(distance) == output;
    }
}
