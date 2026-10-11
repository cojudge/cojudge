class Marker {
    public int minDeletionSize(String[] strs) {
        int rows = strs.length;
        if (rows <= 1) return 0;
        int cols = strs[0].length();
        boolean[] done = new boolean[rows];
        int del = 0;
        for (int c = 0; c < cols; c++) {
            boolean bad = false;
            for (int r = 0; r + 1 < rows; r++) {
                if (!done[r] && strs[r].charAt(c) > strs[r + 1].charAt(c)) {
                    bad = true;
                    break;
                }
            }
            if (bad) {
                del++;
                continue;
            }
            for (int r = 0; r + 1 < rows; r++) {
                if (!done[r] && strs[r].charAt(c) < strs[r + 1].charAt(c)) {
                    done[r] = true;
                }
            }
        }
        return del;
    }
    public boolean isCorrect(String[] strs, int output) {
        return minDeletionSize(strs) == output;
    }
}
