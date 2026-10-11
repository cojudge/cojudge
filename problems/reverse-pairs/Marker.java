class Marker {
    public int reversePairs(int[] nums) {
        int[] copy = nums.clone();
        return mergeSort(copy, 0, copy.length - 1);
    }
    private int mergeSort(int[] a, int l, int r) {
        if (l >= r) return 0;
        int m = l + (r - l) / 2;
        int cnt = mergeSort(a, l, m) + mergeSort(a, m + 1, r);
        int j = m + 1;
        for (int i = l; i <= m; i++) {
            while (j <= r && (long) a[i] > 2L * (long) a[j]) j++;
            cnt += j - (m + 1);
        }
        int[] tmp = new int[r - l + 1];
        int i = l, k = m + 1, t = 0;
        while (i <= m && k <= r) {
            if (a[i] <= a[k]) tmp[t++] = a[i++];
            else tmp[t++] = a[k++];
        }
        while (i <= m) tmp[t++] = a[i++];
        while (k <= r) tmp[t++] = a[k++];
        System.arraycopy(tmp, 0, a, l, tmp.length);
        return cnt;
    }
    public boolean isCorrect(int[] nums, int output) {
        return reversePairs(nums) == output;
    }
}
