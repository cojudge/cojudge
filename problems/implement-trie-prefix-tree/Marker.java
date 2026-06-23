import java.util.*;

class Marker {
    public List<String> solve(String[] operations, String[] values) {
        List<String> result = new ArrayList<>();
        Trie obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("Trie")) {
                obj = new Trie();
                result.add("null");
            } else if (op.equals("insert")) {
                obj.insert(values[i]);
                result.add("null");
            } else if (op.equals("search")) {
                result.add(String.valueOf(obj.search(values[i])));
            } else if (op.equals("startsWith")) {
                result.add(String.valueOf(obj.startsWith(values[i])));
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, String[] values, List<String> output) {
        return solve(operations, values).equals(output);
    }

    class Trie {
        private TrieNode root;

        public Trie() {
            root = new TrieNode();
        }

        public void insert(String word) {
            TrieNode node = root;
            for (char c : word.toCharArray()) {
                int idx = c - 'a';
                if (node.children[idx] == null) {
                    node.children[idx] = new TrieNode();
                }
                node = node.children[idx];
            }
            node.isEnd = true;
        }

        public boolean search(String word) {
            TrieNode node = root;
            for (char c : word.toCharArray()) {
                int idx = c - 'a';
                if (node.children[idx] == null) return false;
                node = node.children[idx];
            }
            return node.isEnd;
        }

        public boolean startsWith(String prefix) {
            TrieNode node = root;
            for (char c : prefix.toCharArray()) {
                int idx = c - 'a';
                if (node.children[idx] == null) return false;
                node = node.children[idx];
            }
            return true;
        }

        private class TrieNode {
            TrieNode[] children = new TrieNode[26];
            boolean isEnd = false;
        }
    }
}
