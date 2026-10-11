class Marker {
    public int numRookCaptures(char[][] board) {
        int rx = -1;
        int ry = -1;
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                if (board[i][j] == 'R') {
                    rx = i;
                    ry = j;
                }
            }
        }
        int ans = 0;
        int[][] dirs = new int[][]{{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int[] d : dirs) {
            int x = rx + d[0];
            int y = ry + d[1];
            while (x >= 0 && x < board.length && y >= 0 && y < board[0].length) {
                if (board[x][y] == 'B') {
                    break;
                }
                if (board[x][y] == 'p') {
                    ans++;
                    break;
                }
                x += d[0];
                y += d[1];
            }
        }
        return ans;
    }
    public boolean isCorrect(char[][] board, int output) {
        return numRookCaptures(board) == output;
    }
}
