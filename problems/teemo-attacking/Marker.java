class Marker {
    public int findPoisonedDuration(int[] timeSeries, int duration) {
        if (timeSeries == null || timeSeries.length == 0) return 0;
        if (duration <= 0) return 0;
        int total = 0;
        for (int i = 0; i < timeSeries.length - 1; i++) {
            total += Math.min(duration, timeSeries[i + 1] - timeSeries[i]);
        }
        total += duration;
        return total;
    }
    public boolean isCorrect(int[] timeSeries, int duration, int output) {
        return findPoisonedDuration(timeSeries, duration) == output;
    }
}
