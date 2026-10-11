import java.util.*;
class Marker {
    public List<String> readBinaryWatch(int turnedOn) {
        List<String> res = new ArrayList<>();
        for (int h = 0; h < 12; h++) {
            for (int m = 0; m < 60; m++) {
                if (Integer.bitCount(h) + Integer.bitCount(m) == turnedOn) {
                    res.add(h + ":" + (m < 10 ? "0" + m : String.valueOf(m)));
                }
            }
        }
        return res;
    }
    public boolean isCorrect(int turnedOn, List<String> output) {
        if (output == null) return false;
        List<String> expected = readBinaryWatch(turnedOn);
        List<String> a = new ArrayList<>(expected);
        List<String> b = new ArrayList<>(output);
        Collections.sort(a);
        Collections.sort(b);
        return a.equals(b);
    }
}
