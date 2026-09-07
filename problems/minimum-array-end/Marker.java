import java.util.*;
class Marker {
    public String minEnd(int n, int x) {
        return String.valueOf(minEndLong(n, x));
    }

    private long minEndLong(int n, int x) {
        long result = x;
        long remaining = n - 1L;
        long bit = 1;
        while (remaining > 0) {
            if ((result & bit) == 0) {
                result |= (remaining & 1L) * bit;
                remaining >>= 1;
            }
            bit <<= 1;
        }
        return result;
    }

    public boolean isCorrect(int n, int x, String output) {
        if (output == null) return false;
        try {
            long actual = Long.parseLong(output.trim());
            return actual == minEndLong(n, x);
        } catch (NumberFormatException e) {
            return false;
        }
    }
}