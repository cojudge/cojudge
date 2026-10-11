class Marker {
    public int minSwap(int[] nums1, int[] nums2) {
        int n = nums1.length;
        int INF = 1000000;
        int noSwap = 0, swap = 1;
        for (int i = 1; i < n; i++) {
            int newNo = INF, newSwap = INF;
            if (nums1[i] > nums1[i - 1] && nums2[i] > nums2[i - 1]) {
                newNo = Math.min(newNo, noSwap);
                newSwap = Math.min(newSwap, swap + 1);
            }
            if (nums1[i] > nums2[i - 1] && nums2[i] > nums1[i - 1]) {
                newNo = Math.min(newNo, swap);
                newSwap = Math.min(newSwap, noSwap + 1);
            }
            noSwap = newNo;
            swap = newSwap;
        }
        return Math.min(noSwap, swap);
    }
    public boolean isCorrect(int[] nums1, int[] nums2, int output) {
        return minSwap(nums1, nums2) == output;
    }
}
