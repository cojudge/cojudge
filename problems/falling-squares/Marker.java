import java.util.*;
class Marker {
    public int[] fallingSquares(int[][] positions) {
        List<int[]> placed = new ArrayList<>();
        int[] ans = new int[positions.length];
        int curMax = 0;
        for (int i = 0; i < positions.length; i++) {
            int l = positions[i][0];
            int s = positions[i][1];
            int r = l + s;
            int base = 0;
            for (int[] p : placed) {
                int pl = p[0], pr = p[1], top = p[2];
                if (l < pr && r > pl) base = Math.max(base, top);
            }
            int top = base + s;
            placed.add(new int[]{l, r, top});
            curMax = Math.max(curMax, top);
            ans[i] = curMax;
        }
        return ans;
    }
    public boolean isCorrect(int[][] positions, int[] output) {
        int[][] copy = new int[positions.length][];
        for (int i = 0; i < positions.length; i++) copy[i] = positions[i].clone();
        return Arrays.equals(fallingSquares(copy), output);
    }
}
