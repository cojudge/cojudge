class Marker {
    public boolean increasingTriplet(int[] nums) {
        int first = Integer.MAX_VALUE;
        int second = Integer.MAX_VALUE;
        for (int x : nums) {
            if (x <= first) first = x;
            else if (x <= second) second = x;
            else return true;
        }
        return false;
    }
    public boolean isCorrect(int[] nums, boolean output) {
        return increasingTriplet(nums) == output;
    }
}
