import java.util.*;
class Marker {
    public boolean isOneBitCharacter(int[] bits) {
        int i = 0;
        int n = bits.length;
        while (i < n - 1) {
            if (bits[i] == 1) i += 2;
            else i += 1;
        }
        return i == n - 1;
    }
    public boolean isCorrect(int[] bits, boolean output) {
        return isOneBitCharacter(bits) == output;
    }
}
