class Marker {
    public int removeDuplicates(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        int[] a = nums.clone();
        int k = 1;
        for (int i = 1; i < a.length; i++) {
            if (a[i] != a[k - 1]) {
                a[k] = a[i];
                k++;
            }
        }
        return k;
    }
    public boolean isCorrect(int[] nums, int output) {
        return output == removeDuplicates(nums);
    }
}
