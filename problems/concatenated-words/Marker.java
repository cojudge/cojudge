import java.util.*;
class Marker {
    public List<String> findAllConcatenatedWordsInADict(String[] words) {
        String[] sorted = words.clone();
        Arrays.sort(sorted, Comparator.comparingInt(String::length));
        Set<String> dict = new HashSet<>();
        List<String> ans = new ArrayList<>();
        int i = 0;
        while (i < sorted.length) {
            int j = i;
            while (j < sorted.length && sorted[j].length() == sorted[i].length()) j++;
            for (int k = i; k < j; k++) {
                if (!dict.isEmpty() && canForm(sorted[k], dict)) ans.add(sorted[k]);
            }
            for (int k = i; k < j; k++) dict.add(sorted[k]);
            i = j;
        }
        return ans;
    }
    private boolean canForm(String s, Set<String> dict) {
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        for (int end = 1; end <= n; end++) {
            for (int start = 0; start < end; start++) {
                if (!dp[start]) continue;
                if (dict.contains(s.substring(start, end))) {
                    dp[end] = true;
                    break;
                }
            }
        }
        return dp[n];
    }
    public boolean isCorrect(String[] words, List<String> output) {
        if (output == null) return false;
        List<String> expected = findAllConcatenatedWordsInADict(words);
        return new HashSet<>(expected).equals(new HashSet<>(output));
    }
}
