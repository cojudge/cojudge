class Marker {
    public int totalHammingDistance(int[] nums) {
        int n = nums.length;
        int total = 0;
        for (int bit = 0; bit < 31; bit++) {
            int ones = 0;
            for (int v : nums) {
                if (((v >> bit) & 1) == 1) ones++;
            }
            total += ones * (n - ones);
        }
        return total;
    }
    public boolean isCorrect(int[] nums, int output) {
        return totalHammingDistance(nums) == output;
    }
}
