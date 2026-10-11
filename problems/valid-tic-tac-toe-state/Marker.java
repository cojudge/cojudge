class Marker {
    public boolean validTicTacToe(String[] board) {
        String[] b = normalize(board);
        int x = 0, o = 0;
        for (String row : b) for (char c : row.toCharArray()) {
            if (c == 'X') x++;
            else if (c == 'O') o++;
        }
        if (o > x || x > o + 1) return false;
        boolean xWin = hasWin(b, 'X');
        boolean oWin = hasWin(b, 'O');
        if (xWin && oWin) return false;
        if (xWin && x != o + 1) return false;
        if (oWin && x != o) return false;
        return true;
    }
    private String[] normalize(String[] board) {
        String[] b = new String[3];
        for (int i = 0; i < 3; i++) {
            String r = board[i] == null ? "" : board[i];
            // accept both '-' and ' ' / '.' as empty for robustness
            r = r.replace(' ', '-').replace('.', '-');
            while (r.length() < 3) r = r + "-";
            if (r.length() > 3) r = r.substring(0, 3);
            b[i] = r;
        }
        return b;
    }
    private boolean hasWin(String[] b, char p) {
        for (int i = 0; i < 3; i++) {
            if (b[i].charAt(0) == p && b[i].charAt(1) == p && b[i].charAt(2) == p) return true;
            if (b[0].charAt(i) == p && b[1].charAt(i) == p && b[2].charAt(i) == p) return true;
        }
        if (b[0].charAt(0) == p && b[1].charAt(1) == p && b[2].charAt(2) == p) return true;
        if (b[0].charAt(2) == p && b[1].charAt(1) == p && b[2].charAt(0) == p) return true;
        return false;
    }
    public boolean isCorrect(String[] board, boolean output) {
        return validTicTacToe(board) == output;
    }
}
