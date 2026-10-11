import java.util.*;
class Marker {
    public int[] getRow(int rowIndex) {
        int[] row = new int[rowIndex + 1];
        row[0] = 1;
        for (int r = 1; r <= rowIndex; r++) {
            row[r] = 1;
            for (int c = r - 1; c > 0; c--) {
                row[c] = row[c] + row[c - 1];
            }
        }
        return row;
    }
    public boolean isCorrect(int rowIndex, int[] output) {
        return Arrays.equals(getRow(rowIndex), output);
    }
}
