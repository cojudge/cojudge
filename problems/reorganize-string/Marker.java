import java.util.*;

class Marker {
    class Node {
        int freq;
        char ch;
        Node(int freq, char ch) {
            this.freq = freq;
            this.ch = ch;
        }
    }

    public String reorganizeString(String s) {
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
        }

        PriorityQueue<Node> heap = new PriorityQueue<>((a, b) ->
            a.freq != b.freq ? b.freq - a.freq : a.ch - b.ch
        );
        for (int i = 0; i < 26; i++) {
            if (count[i] > 0) {
                heap.add(new Node(count[i], (char) ('a' + i)));
            }
        }

        StringBuilder res = new StringBuilder();
        char prevChar = '#';
        int prevFreq = 0;
        while (!heap.isEmpty()) {
            Node node = heap.poll();
            res.append(node.ch);
            if (prevFreq > 0) {
                heap.add(new Node(prevFreq, prevChar));
            }
            prevChar = node.ch;
            prevFreq = node.freq - 1;
        }
        if (prevFreq > 0) {
            return "";
        }
        return res.toString();
    }

    private boolean isValidRearrangement(String s, String candidate) {
        if (candidate.isEmpty()) {
            int[] count = new int[26];
            int max = 0;
            for (int i = 0; i < s.length(); i++) {
                count[s.charAt(i) - 'a']++;
                max = Math.max(max, count[s.charAt(i) - 'a']);
            }
            return max > (s.length() + 1) / 2;
        }
        if (candidate.length() != s.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < candidate.length(); i++) {
            char c = candidate.charAt(i);
            if (c < 'a' || c > 'z') return false;
            count[c - 'a']++;
            if (i > 0 && candidate.charAt(i - 1) == c) return false;
        }
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']--;
        }
        for (int i = 0; i < 26; i++) {
            if (count[i] != 0) return false;
        }
        return true;
    }

    public boolean isCorrect(String s, String output) {
        String expected = reorganizeString(s);
        if (!isValidRearrangement(s, expected)) {
            return false;
        }
        return expected.equals(output);
    }
}