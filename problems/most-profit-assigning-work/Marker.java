import java.util.*;
class Marker {
    public int maxProfitAssignment(int[] difficulty, int[] profit, int[] worker) {
        int n = difficulty.length;
        int[][] jobs = new int[n][2];
        for (int i = 0; i < n; i++) {
            jobs[i][0] = difficulty[i];
            jobs[i][1] = profit[i];
        }
        Arrays.sort(jobs, (a, b) -> Integer.compare(a[0], b[0]));
        int[] bestUpTo = new int[n];
        int mx = 0;
        for (int i = 0; i < n; i++) {
            mx = Math.max(mx, jobs[i][1]);
            bestUpTo[i] = mx;
        }
        int ans = 0;
        for (int w : worker) {
            int lo = 0, hi = n - 1, idx = -1;
            while (lo <= hi) {
                int mid = (lo + hi) / 2;
                if (jobs[mid][0] <= w) {
                    idx = mid;
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
            if (idx >= 0) ans += bestUpTo[idx];
        }
        return ans;
    }
    public boolean isCorrect(int[] difficulty, int[] profit, int[] worker, int output) {
        return maxProfitAssignment(difficulty, profit, worker) == output;
    }
}
