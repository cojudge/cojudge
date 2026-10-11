class Marker {
    public int magicalString(int n) {
        if (n <= 0) return 0;
        if (n <= 3) return 1;
        int[] s = new int[n];
        s[0] = 1; s[1] = 2; s[2] = 2;
        int len = 3;
        int idx = 2;
        int next = 1;
        while (len < n) {
            int count = s[idx];
            for (int c = 0; c < count && len < n; c++) {
                s[len++] = next;
            }
            next = 3 - next;
            idx++;
        }
        int ones = 0;
        for (int i = 0; i < n; i++) if (s[i] == 1) ones++;
        return ones;
    }
    public boolean isCorrect(int n, int output) {
        return magicalString(n) == output;
    }
}
