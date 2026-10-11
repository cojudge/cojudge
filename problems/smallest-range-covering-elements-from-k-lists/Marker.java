import java.util.*;
class Marker {
    public int[] smallestRange(int[][] nums) {
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(nums[a[0]][a[1]], nums[b[0]][b[1]]));
        int curMax = Integer.MIN_VALUE;
        for (int i = 0; i < nums.length; i++) {
            pq.offer(new int[]{i, 0});
            curMax = Math.max(curMax, nums[i][0]);
        }
        int bestA = 0, bestB = Integer.MAX_VALUE;
        while (true) {
            int[] top = pq.poll();
            int v = nums[top[0]][top[1]];
            if (curMax - v < bestB - bestA || (curMax - v == bestB - bestA && v < bestA)) {
                bestA = v; bestB = curMax;
            }
            if (top[1] + 1 >= nums[top[0]].length) break;
            int ni = top[1] + 1;
            pq.offer(new int[]{top[0], ni});
            curMax = Math.max(curMax, nums[top[0]][ni]);
        }
        return new int[]{bestA, bestB};
    }
    public boolean isCorrect(int[][] nums, int[] output) {
        return Arrays.equals(smallestRange(nums), output);
    }
}
