class Marker {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        int[] a = nums.clone();
        for (int i = 0; i < n; i++) {
            while (a[i] >= 1 && a[i] <= n && a[a[i] - 1] != a[i]) {
                int t = a[a[i] - 1];
                a[a[i] - 1] = a[i];
                a[i] = t;
            }
        }
        for (int i = 0; i < n; i++) {
            if (a[i] != i + 1) return i + 1;
        }
        return n + 1;
    }
    public boolean isCorrect(int[] nums, int output) {
        return firstMissingPositive(nums) == output;
    }
}
