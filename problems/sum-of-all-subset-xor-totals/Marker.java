import java.util.*;

class Marker {
    public int subsetXORSum(int[] nums) {
        return collect(nums, 0, 0);
    }

    private int collect(int[] nums, int index, int current) {
        if (index == nums.length) {
            return current;
        }
        return collect(nums, index + 1, current)
                + collect(nums, index + 1, current ^ nums[index]);
    }

    public boolean isCorrect(int[] nums, int output) {
        return subsetXORSum(nums) == output;
    }
}