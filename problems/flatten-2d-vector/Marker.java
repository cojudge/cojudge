import java.util.*;
class Marker {
    public int[] runVector2D(int[][] vec, String[] operations) {
        List<Integer> flat = new ArrayList<>();
        if (vec != null) {
            for (int[] row : vec) {
                if (row == null) continue;
                for (int v : row) flat.add(v);
            }
        }
        List<Integer> ans = new ArrayList<>();
        int idx = 0;
        for (String op : operations) {
            if (op.equals("next")) {
                ans.add(flat.get(idx));
                idx++;
            } else if (op.equals("hasNext")) {
                ans.add(idx < flat.size() ? 1 : 0);
            }
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(int[][] vec, String[] operations, int[] output) {
        return output != null && Arrays.equals(runVector2D(vec, operations), output);
    }
}
