import java.util.*;
class Marker {
    public int wordsTyping(String[] sentence, int rows, int cols) {
        StringBuilder sb = new StringBuilder();
        for (String w : sentence) sb.append(w).append(' ');
        String s = sb.toString();
        int L = s.length();
        int pos = 0;
        for (int r = 0; r < rows; r++) {
            pos += cols;
            if (s.charAt(pos % L) == ' ') {
                pos++;
            } else {
                while (pos > 0 && s.charAt((pos - 1) % L) != ' ') pos--;
            }
        }
        return pos / L;
    }
    public boolean isCorrect(String[] sentence, int rows, int cols, int output) {
        return wordsTyping(sentence, rows, cols) == output;
    }
}
