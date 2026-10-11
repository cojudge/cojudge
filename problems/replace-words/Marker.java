import java.util.*;
class Marker {
    static class Node {
        Node[] next = new Node[26];
        boolean end;
    }
    public String replaceWords(String[] dictionary, String sentence) {
        Node root = new Node();
        for (String w : dictionary) {
            Node cur = root;
            for (char c : w.toCharArray()) {
                int i = c - 'a';
                if (cur.next[i] == null) cur.next[i] = new Node();
                cur = cur.next[i];
            }
            cur.end = true;
        }
        String[] words = sentence.split(" ");
        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < words.length; k++) {
            if (k > 0) sb.append(' ');
            sb.append(shortest(root, words[k]));
        }
        return sb.toString();
    }
    private String shortest(Node root, String w) {
        Node cur = root;
        StringBuilder pre = new StringBuilder();
        for (char c : w.toCharArray()) {
            if (cur.end) return pre.toString();
            int i = c - 'a';
            if (i < 0 || i >= 26 || cur.next[i] == null) return w;
            cur = cur.next[i];
            pre.append(c);
        }
        return cur.end ? pre.toString() : w;
    }
    public boolean isCorrect(String[] dictionary, String sentence, String output) {
        return replaceWords(dictionary, sentence).equals(output);
    }
}
