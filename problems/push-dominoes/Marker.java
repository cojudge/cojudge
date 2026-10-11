class Marker {
    public String pushDominoes(String dominoes) {
        int n = dominoes.length();
        int[] force = new int[n];
        int f = 0;
        for (int i = 0; i < n; i++) {
            char c = dominoes.charAt(i);
            if (c == 'R') f = n;
            else if (c == 'L') f = 0;
            else f = Math.max(f - 1, 0);
            force[i] += f;
        }
        f = 0;
        for (int i = n - 1; i >= 0; i--) {
            char c = dominoes.charAt(i);
            if (c == 'L') f = n;
            else if (c == 'R') f = 0;
            else f = Math.max(f - 1, 0);
            force[i] -= f;
        }
        StringBuilder sb = new StringBuilder();
        for (int x : force) sb.append(x > 0 ? 'R' : x < 0 ? 'L' : '.');
        return sb.toString();
    }
    public boolean isCorrect(String dominoes, String output) {
        return pushDominoes(dominoes).equals(output);
    }
}
