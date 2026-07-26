import java.math.BigDecimal;

class Marker {
    public String findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }

        int total = nums1.length + nums2.length;
        int leftSize = (total + 1) / 2;
        int low = 0;
        int high = nums1.length;

        while (low <= high) {
            int partition1 = low + (high - low) / 2;
            int partition2 = leftSize - partition1;

            int left1 = partition1 == 0 ? Integer.MIN_VALUE : nums1[partition1 - 1];
            int right1 = partition1 == nums1.length ? Integer.MAX_VALUE : nums1[partition1];
            int left2 = partition2 == 0 ? Integer.MIN_VALUE : nums2[partition2 - 1];
            int right2 = partition2 == nums2.length ? Integer.MAX_VALUE : nums2[partition2];

            if (left1 <= right2 && left2 <= right1) {
                long lowerMiddle = Math.max(left1, left2);
                if ((total & 1) == 1) return lowerMiddle + ".0";

                long upperMiddle = Math.min(right1, right2);
                return formatHalf(lowerMiddle + upperMiddle);
            }

            if (left1 > right2) {
                high = partition1 - 1;
            } else {
                low = partition1 + 1;
            }
        }
        throw new IllegalArgumentException("Input arrays must be sorted");
    }

    private String formatHalf(long sum) {
        if ((sum & 1L) == 0) return (sum / 2) + ".0";
        long magnitude = Math.abs(sum);
        return (sum < 0 ? "-" : "") + (magnitude / 2) + ".5";
    }

    public boolean isCorrect(int[] nums1, int[] nums2, String output) {
        if (output == null) return false;
        try {
            BigDecimal expected = new BigDecimal(findMedianSortedArrays(nums1, nums2));
            BigDecimal actual = new BigDecimal(output.trim());
            return expected.compareTo(actual) == 0;
        } catch (NumberFormatException error) {
            return false;
        }
    }
}
