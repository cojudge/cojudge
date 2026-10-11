import java.util.*;
class Marker {
    private long d2(int[] a, int[] b) {
        long dx = (long)a[0]-b[0], dy = (long)a[1]-b[1];
        return dx*dx+dy*dy;
    }
    public boolean validSquare(int[] p1, int[] p2, int[] p3, int[] p4) {
        int[][] pts = {p1,p2,p3,p4};
        long[] d = new long[6];
        int k = 0;
        for (int i = 0; i < 4; i++) for (int j = i+1; j < 4; j++) d[k++] = d2(pts[i], pts[j]);
        Arrays.sort(d);
        return d[0] > 0 && d[0]==d[1] && d[1]==d[2] && d[2]==d[3] && d[4]==d[5] && d[4]==2*d[0];
    }
    public boolean isCorrect(int[] p1, int[] p2, int[] p3, int[] p4, boolean output) {
        return validSquare(p1,p2,p3,p4) == output;
    }
}
