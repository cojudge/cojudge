import java.util.*;
class Marker {
    public int findNthDigit(int n) {
        long pos = n;
        long len = 1, count = 9, start = 1;
        while (pos > len * count) {
            pos -= len * count;
            len++;
            count *= 10;
            start *= 10;
        }
        long num = start + (pos - 1) / len;
        int idx = (int) ((pos - 1) % len);
        return String.valueOf(num).charAt(idx) - '0';
    }
    public boolean isCorrect(int n, int output) {
        return output == findNthDigit(n);
    }
}
