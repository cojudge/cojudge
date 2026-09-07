import java.util.*;
class Marker {
    public int rangeBitwiseAnd(int left, int right) {
        int shift = 0;
        while (left < right) {
            left >>= 1;
            right >>= 1;
            shift++;
        }
        return left << shift;
    }
    public boolean isCorrect(int left, int right, int output) {
        return rangeBitwiseAnd(left, right) == output;
    }
}