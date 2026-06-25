import java.util.*;

class Marker {
    public List<String> solve(String[] operations, String[] values) {
        List<String> result = new ArrayList<>();
        WordDictionary obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("WordDictionary")) {
                obj = new WordDictionary();
                result.add("null");
            } else if (op.equals("addWord")) {
                obj.addWord(values[i]);
                result.add("null");
            } else if (op.equals("search")) {
                result.add(String.valueOf(obj.search(values[i])));
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, String[] values, List<String> output) {
        return solve(operations, values).equals(output);
    }

    class WordDictionary {
        private TrieNode root;

        public WordDictionary() {
            root = new TrieNode();
        }

        public void addWord(String word) {
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
            return search(word, 0, root);
        }

        private boolean search(String word, int index, TrieNode node) {
            for (int i = index; i < word.length(); i++) {
                char c = word.charAt(i);
                if (c == '.') {
                    for (TrieNode child : node.children) {
                        if (child != null && search(word, i + 1, child)) {
                            return true;
                        }
                    }
                    return false;
                } else {
                    int idx = c - 'a';
                    if (node.children[idx] == null) return false;
                    node = node.children[idx];
                }
            }
            return node.isEnd;
        }

        private class TrieNode {
            TrieNode[] children = new TrieNode[26];
            boolean isEnd = false;
        }
    }
}
