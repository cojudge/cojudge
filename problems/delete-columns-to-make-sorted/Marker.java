class Marker {
    public int minDeletionSize(String[] strs) {
        if (strs.length == 0) return 0;
        int cols = strs[0].length();
        int del = 0;
        for (int c = 0; c < cols; c++) {
            for (int r = 0; r + 1 < strs.length; r++) {
                if (strs[r].charAt(c) > strs[r + 1].charAt(c)) {
                    del++;
                    break;
                }
            }
        }
        return del;
    }
    public boolean isCorrect(String[] strs, int output) {
        return minDeletionSize(strs) == output;
    }
}
