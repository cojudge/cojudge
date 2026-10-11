class Marker {
    public String findContestMatch(int n) {
        String[] cur = new String[n];
        for (int i = 0; i < n; i++) cur[i] = String.valueOf(i + 1);
        int size = n;
        while (size > 1) {
            for (int i = 0; i < size / 2; i++) {
                cur[i] = "(" + cur[i] + "," + cur[size - 1 - i] + ")";
            }
            size /= 2;
        }
        return cur[0];
    }
    public boolean isCorrect(int n, String output) {
        return findContestMatch(n).equals(output);
    }
}
