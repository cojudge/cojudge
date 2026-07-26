import java.util.*;

class Marker {
    public int ladderLength(String beginWord, String endWord, String[] wordList) {
        if (beginWord.equals(endWord)) return 1;
        Set<String> unused = new HashSet<>(Arrays.asList(wordList));
        if (!unused.contains(endWord)) return 0;

        Set<String> front = new HashSet<>();
        Set<String> back = new HashSet<>();
        front.add(beginWord);
        back.add(endWord);
        unused.remove(beginWord);
        unused.remove(endWord);
        int length = 1;

        while (!front.isEmpty() && !back.isEmpty()) {
            if (front.size() > back.size()) {
                Set<String> temp = front;
                front = back;
                back = temp;
            }
            Set<String> next = new HashSet<>();
            for (String word : front) {
                char[] chars = word.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char original = chars[i];
                    for (char replacement = 'a'; replacement <= 'z'; replacement++) {
                        if (replacement == original) continue;
                        chars[i] = replacement;
                        String candidate = new String(chars);
                        if (back.contains(candidate)) return length + 1;
                        if (unused.remove(candidate)) next.add(candidate);
                    }
                    chars[i] = original;
                }
            }
            front = next;
            length++;
        }
        return 0;
    }

    public boolean isCorrect(String beginWord, String endWord, String[] wordList, int output) {
        return ladderLength(beginWord, endWord, wordList) == output;
    }
}
