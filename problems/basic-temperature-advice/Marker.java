import java.util.*;
class Marker {
    public String tempAdvice(int t) {
        if (t < 0) return "Freezing";
        if (t < 15) return "Cold";
        if (t < 25) return "Warm";
        return "Hot";
    }
    public boolean isCorrect(int t, String output) {
        return tempAdvice(t).equals(output);
    }
}
