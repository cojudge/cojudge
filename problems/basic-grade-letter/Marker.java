import java.util.*;
class Marker {
    public String gradeLetter(int score) {
        if (score >= 90) return "A";
        if (score >= 80) return "B";
        if (score >= 70) return "C";
        if (score >= 60) return "D";
        return "F";
    }
    public boolean isCorrect(int score, String output) {
        return gradeLetter(score).equals(output);
    }
}
