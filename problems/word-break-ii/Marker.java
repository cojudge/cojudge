import java.util.*;

class Marker {
    public List<String> wordBreak(String s, String[] wordDict) {
        Set<String> dict = new HashSet<>(Arrays.asList(wordDict));
        Map<Integer, List<String>> memo = new HashMap<>();
        List<String> result = breakAt(s, 0, dict, memo);
        Collections.sort(result);
        return result;
    }

    private List<String> breakAt(String s, int start, Set<String> dict, Map<Integer, List<String>> memo) {
        if (start == s.length()) {
            List<String> base = new ArrayList<>();
            base.add("");
            return base;
        }
        List<String> cached = memo.get(start);
        if (cached != null) {
            return cached;
        }
        List<String> result = new ArrayList<>();
        for (int end = start + 1; end <= s.length(); end++) {
            String word = s.substring(start, end);
            if (!dict.contains(word)) continue;
            for (String tail : breakAt(s, end, dict, memo)) {
                result.add(tail.isEmpty() ? word : word + " " + tail);
            }
        }
        memo.put(start, result);
        return result;
    }

    public boolean isCorrect(String s, String[] wordDict, List<String> output) {
        List<String> expected = new ArrayList<>(wordBreak(s, wordDict));
        Collections.sort(expected);
        List<String> actual = output == null ? new ArrayList<>() : new ArrayList<>(output);
        Collections.sort(actual);
        return expected.equals(actual);
    }
}