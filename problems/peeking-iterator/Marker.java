import java.util.*;
class Marker {
    public int[] runPeek(int[] nums, String[] operations) {
        List<Integer> out = new ArrayList<>();
        int idx = 0;
        for (String op : operations) {
            if (op.equals("next")) { out.add(nums[idx]); idx++; }
            else if (op.equals("peek")) { out.add(nums[idx]); }
            else if (op.equals("hasNext")) { out.add(idx < nums.length ? 1 : 0); }
        }
        return out.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(int[] nums, String[] operations, int[] output) {
        return Arrays.equals(runPeek(nums, operations), output);
    }
}
