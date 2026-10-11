import java.util.*;
class Marker {
    public boolean validUtf8(int[] data) {
        int need = 0;
        for (int v : data) {
            int b = v & 0xFF;
            if (need == 0) {
                if ((b >> 7) == 0) continue;
                int ones = 0;
                for (int k = 7; k >= 0 && ((b >> k) & 1) == 1; k--) ones++;
                if (ones == 1 || ones > 4) return false;
                need = ones - 1;
            } else {
                if ((b >> 6) != 0b10) return false;
                need--;
            }
        }
        return need == 0;
    }
    public boolean isCorrect(int[] data, boolean output) {
        return output == validUtf8(data);
    }
}
