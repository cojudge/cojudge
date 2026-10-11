import java.util.*;
class Marker {
    public String reverseWords(String s) {
        String[] parts = s.trim().split("\\s+");
        List<String> words = new ArrayList<>();
        for (String w : parts) if (!w.isEmpty()) words.add(w);
        Collections.reverse(words);
        return String.join(" ", words);
    }
    public boolean isCorrect(String s, String output) {
        return reverseWords(s).equals(output);
    }
}
