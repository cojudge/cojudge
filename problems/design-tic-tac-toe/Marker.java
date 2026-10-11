import java.util.*;
class Marker {
    public int[] runTicTacToe(String[] operations, int[][] args) {
        int n = args[0][0];
        int[] rows = new int[n];
        int[] cols = new int[n];
        int diag = 0, anti = 0;
        List<Integer> out = new ArrayList<>();
        for (int i = 1; i < operations.length; i++) {
            if (operations[i].equals("move")) {
                int r = args[i][0], c = args[i][1], p = args[i][2];
                int d = (p == 1) ? 1 : -1;
                rows[r] += d; cols[c] += d;
                if (r == c) diag += d;
                if (r + c == n - 1) anti += d;
                if (Math.abs(rows[r]) == n || Math.abs(cols[c]) == n
                        || Math.abs(diag) == n || Math.abs(anti) == n) {
                    out.add(p);
                } else {
                    out.add(0);
                }
            }
        }
        return out.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, int[][] args, int[] output) {
        return output != null && Arrays.equals(runTicTacToe(operations, args), output);
    }
}
