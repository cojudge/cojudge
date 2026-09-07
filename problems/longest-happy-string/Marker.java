class Marker {
    public String longestDiverseString(int a, int b, int c) {
        int[] count = {a, b, c};
        StringBuilder res = new StringBuilder();
        int last = -1;
        int secondLast = -1;

        while (true) {
            int best = -1;
            for (int ch = 0; ch < 3; ch++) {
                if (count[ch] == 0) continue;
                if (ch == last && ch == secondLast) continue;
                if (best == -1 || count[ch] > count[best]) best = ch;
            }
            if (best == -1) break;
            res.append((char) ('a' + best));
            count[best]--;
            secondLast = last;
            last = best;
        }
        return res.toString();
    }

    private boolean isValidHappyString(int a, int b, int c, String candidate) {
        int[] used = new int[3];
        for (int i = 0; i < candidate.length(); i++) {
            char ch = candidate.charAt(i);
            if (ch < 'a' || ch > 'c') return false;
            used[ch - 'a']++;
            if (i >= 2 && candidate.charAt(i - 1) == ch && candidate.charAt(i - 2) == ch) {
                return false;
            }
        }
        return used[0] <= a && used[1] <= b && used[2] <= c;
    }

    public boolean isCorrect(int a, int b, int c, String output) {
        String expected = longestDiverseString(a, b, c);
        if (!isValidHappyString(a, b, c, expected)) {
            return false;
        }
        return expected.equals(output);
    }
}