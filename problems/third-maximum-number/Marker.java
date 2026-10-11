import java.util.*;
class Marker {
    public int thirdMax(int[] nums) {
        Long m1 = null, m2 = null, m3 = null;
        for (int x : nums) {
            long v = x;
            if ((m1 != null && v == m1) || (m2 != null && v == m2) || (m3 != null && v == m3)) continue;
            if (m1 == null || v > m1) {
                m3 = m2; m2 = m1; m1 = v;
            } else if (m2 == null || v > m2) {
                m3 = m2; m2 = v;
            } else if (m3 == null || v > m3) {
                m3 = v;
            }
        }
        return (m3 == null ? m1 : m3).intValue();
    }
    public boolean isCorrect(int[] nums, int output) {
        return thirdMax(nums) == output;
    }
}
