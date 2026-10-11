import java.util.*;
class Marker {
    public int minSwapsCouples(int[] row) {
        int n = row.length;
        int[] pos = new int[n];
        for (int i = 0; i < n; i++) pos[row[i]] = i;
        int swaps = 0;
        for (int i = 0; i < n; i += 2) {
            int partner = row[i] % 2 == 0 ? row[i] + 1 : row[i] - 1;
            if (row[i + 1] == partner) continue;
            int j = pos[partner];
            int tmp = row[i + 1];
            row[i + 1] = partner;
            row[j] = tmp;
            pos[tmp] = j;
            pos[partner] = i + 1;
            swaps++;
        }
        return swaps;
    }
    public boolean isCorrect(int[] row, int output) {
        return output == minSwapsCouples(row.clone());
    }
}
