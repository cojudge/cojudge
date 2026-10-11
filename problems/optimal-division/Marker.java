class Marker {
    public String optimalDivision(int[] nums) {
        if (nums.length == 1) return String.valueOf(nums[0]);
        if (nums.length == 2) return nums[0] + "/" + nums[1];
        StringBuilder sb = new StringBuilder();
        sb.append(nums[0]).append("/(").append(nums[1]);
        for (int i = 2; i < nums.length; i++) sb.append("/").append(nums[i]);
        sb.append(")");
        return sb.toString();
    }
    public boolean isCorrect(int[] nums, String output) {
        return optimalDivision(nums).equals(output);
    }
}
