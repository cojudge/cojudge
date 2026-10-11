import java.util.*;
class Marker {
    public int[] runShortestWordDistance(String[] wordsDict, String[] word1s, String[] word2s) {
        Map<String, List<Integer>> pos = new HashMap<>();
        for (int i = 0; i < wordsDict.length; i++) {
            pos.computeIfAbsent(wordsDict[i], k -> new ArrayList<>()).add(i);
        }
        int[] ans = new int[word1s.length];
        for (int q = 0; q < word1s.length; q++) {
            List<Integer> a = pos.get(word1s[q]);
            List<Integer> b = pos.get(word2s[q]);
            int i = 0, j = 0, best = Integer.MAX_VALUE;
            while (i < a.size() && j < b.size()) {
                best = Math.min(best, Math.abs(a.get(i) - b.get(j)));
                if (a.get(i) < b.get(j)) i++;
                else j++;
            }
            ans[q] = best;
        }
        return ans;
    }

    public boolean isCorrect(String[] wordsDict, String[] word1s, String[] word2s, int[] output) {
        return output != null && Arrays.equals(runShortestWordDistance(wordsDict, word1s, word2s), output);
    }
}
