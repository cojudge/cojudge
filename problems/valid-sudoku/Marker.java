class Marker {
    public boolean isValidSudoku(String[] board) {
        if (board == null || board.length != 9) return false;

        int[] rows = new int[9];
        int[] columns = new int[9];
        int[] boxes = new int[9];
        for (int row = 0; row < 9; row++) {
            if (board[row] == null || board[row].length() != 9) return false;
            for (int column = 0; column < 9; column++) {
                char cell = board[row].charAt(column);
                if (cell == '.') continue;
                if (cell < '1' || cell > '9') return false;

                int bit = 1 << (cell - '1');
                int box = (row / 3) * 3 + column / 3;
                if ((rows[row] & bit) != 0
                        || (columns[column] & bit) != 0
                        || (boxes[box] & bit) != 0) {
                    return false;
                }
                rows[row] |= bit;
                columns[column] |= bit;
                boxes[box] |= bit;
            }
        }
        return true;
    }

    public boolean isCorrect(String[] board, boolean output) {
        return output == isValidSudoku(board);
    }
}
