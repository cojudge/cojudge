class Marker {
    public int leastInterval(String tasks, int n) {
        int[] frequencies = new int[26];
        for (int i = 0; i < tasks.length(); i++) {
            frequencies[tasks.charAt(i) - 'A']++;
        }

        int maximum = 0;
        for (int frequency : frequencies) maximum = Math.max(maximum, frequency);

        int maximumCount = 0;
        for (int frequency : frequencies) {
            if (frequency == maximum) maximumCount++;
        }

        int blockSchedule = (maximum - 1) * (n + 1) + maximumCount;
        return Math.max(tasks.length(), blockSchedule);
    }

    public boolean isCorrect(String tasks, int n, int output) {
        return leastInterval(tasks, n) == output;
    }
}
