import java.util.*;
class Marker {
    public List<List<Integer>> employeeFreeTime(int[][] schedule) {
        List<int[]> all = new ArrayList<>();
        for (int[] emp : schedule) {
            for (int i = 0; i + 1 < emp.length; i += 2) {
                all.add(new int[]{emp[i], emp[i + 1]});
            }
        }
        all.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
        List<List<Integer>> res = new ArrayList<>();
        if (all.isEmpty()) return res;
        int prevEnd = all.get(0)[1];
        for (int i = 1; i < all.size(); i++) {
            int s = all.get(i)[0], e = all.get(i)[1];
            if (s > prevEnd) {
                res.add(Arrays.asList(prevEnd, s));
                prevEnd = e;
            } else {
                prevEnd = Math.max(prevEnd, e);
            }
        }
        return res;
    }
    public boolean isCorrect(int[][] schedule, List<List<Integer>> output) {
        int[][] copy = new int[schedule.length][];
        for (int i = 0; i < schedule.length; i++) copy[i] = schedule[i].clone();
        return employeeFreeTime(copy).equals(output);
    }
}
