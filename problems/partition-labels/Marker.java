import java.util.*;

class Marker {
    public int[] partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) {
            last[s.charAt(i) - 'a'] = i;
        }

        int[] sizes = new int[s.length()];
        int sizeCount = 0;
        int start = 0;
        int end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) {
                sizes[sizeCount++] = end - start + 1;
                start = i + 1;
            }
        }
        return Arrays.copyOf(sizes, sizeCount);
    }

    public boolean isCorrect(String s, int[] output) {
        return Arrays.equals(partitionLabels(s), output);
    }
}
