import java.util.*;
class Marker {
    public int[] runNumArray(int[] nums, String[] operations, int[][] values) {
        int[] a = nums.clone();
        List<Integer> ans = new ArrayList<>();
        for (int k = 0; k < operations.length; k++) {
            if (operations[k].equals("update")) {
                a[values[k][0]] = values[k][1];
            } else {
                int s = 0;
                for (int i = values[k][0]; i <= values[k][1]; i++) s += a[i];
                ans.add(s);
            }
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(int[] nums, String[] operations, int[][] values, int[] output) {
        return Arrays.equals(runNumArray(nums, operations, values), output);
    }
}
