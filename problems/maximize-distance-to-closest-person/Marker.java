class Marker {
    public int maxDistToClosest(int[] seats) {
        int n = seats.length, best = 0, prev = -1;
        for (int i = 0; i < n; i++) {
            if (seats[i] == 1) {
                if (prev < 0) best = i;
                else best = Math.max(best, (i - prev) / 2);
                prev = i;
            }
        }
        best = Math.max(best, n - 1 - prev);
        return best;
    }
    public boolean isCorrect(int[] seats, int output) {
        return maxDistToClosest(seats) == output;
    }
}
