import java.util.*;
class Marker {
    public int[][] intervalIntersection(int[][] firstList, int[][] secondList) {
        List<int[]> out = new ArrayList<>();
        int i = 0;
        int j = 0;
        while (i < firstList.length && j < secondList.length) {
            int lo = Math.max(firstList[i][0], secondList[j][0]);
            int hi = Math.min(firstList[i][1], secondList[j][1]);
            if (lo <= hi) out.add(new int[]{lo, hi});
            if (firstList[i][1] < secondList[j][1]) i++;
            else j++;
        }
        int[][] ans = new int[out.size()][];
        for (int k = 0; k < out.size(); k++) ans[k] = out.get(k);
        return ans;
    }
    public boolean isCorrect(int[][] firstList, int[][] secondList, int[][] output) {
        return Arrays.deepEquals(intervalIntersection(firstList, secondList), output);
    }
}
