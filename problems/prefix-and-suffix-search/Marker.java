import java.util.*;
class Marker {
    public int wordFilter(String[] words, String pref, String suff) {
        for (int i = words.length - 1; i >= 0; i--) {
            if (words[i].startsWith(pref) && words[i].endsWith(suff)) return i;
        }
        return -1;
    }
    public boolean isCorrect(String[] words, String pref, String suff, int output) {
        return wordFilter(words.clone(), pref, suff) == output;
    }
}
