import java.util.*;
class Marker {
    public List<String> findRelativeRanks(int[] score) {
        int n = score.length;
        Integer[] idx = new Integer[n];
        for (int i = 0; i < n; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Integer.compare(score[b], score[a]));
        String[] ans = new String[n];
        for (int rank = 0; rank < n; rank++) {
            int i = idx[rank];
            if (rank == 0) ans[i] = "Gold Medal";
            else if (rank == 1) ans[i] = "Silver Medal";
            else if (rank == 2) ans[i] = "Bronze Medal";
            else ans[i] = String.valueOf(rank + 1);
        }
        return Arrays.asList(ans);
    }
    public boolean isCorrect(int[] score, List<String> output) {
        return findRelativeRanks(score).equals(output);
    }
}
