import java.util.*;
class Marker {
    public String toHex(int num) {
        if (num == 0) return "0";
        char[] dig = "0123456789abcdef".toCharArray();
        long v = num & 0xffffffffL;
        StringBuilder sb = new StringBuilder();
        while (v != 0) {
            sb.append(dig[(int)(v & 0xFL)]);
            v >>>= 4;
        }
        return sb.reverse().toString();
    }
    public boolean isCorrect(int num, String output) {
        if (output == null) return false;
        return toHex(num).equals(output);
    }
}
