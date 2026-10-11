import java.util.*;
class Marker {
    private boolean isVowel(char c) {
        return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u'
                || c == 'A' || c == 'E' || c == 'I' || c == 'O' || c == 'U';
    }
    private String mask(String w) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < w.length(); i++) {
            char c = w.charAt(i);
            sb.append(isVowel(c) ? '*' : Character.toLowerCase(c));
        }
        return sb.toString();
    }
    public List<String> spellchecker(String[] wordlist, String[] queries) {
        Set<String> exact = new HashSet<>(Arrays.asList(wordlist));
        Map<String, String> caseMap = new HashMap<>();
        Map<String, String> vowelMap = new HashMap<>();
        for (String w : wordlist) {
            String lw = w.toLowerCase();
            if (!caseMap.containsKey(lw)) caseMap.put(lw, w);
            String m = mask(w);
            if (!vowelMap.containsKey(m)) vowelMap.put(m, w);
        }
        List<String> ans = new ArrayList<>();
        for (String q : queries) {
            if (exact.contains(q)) ans.add(q);
            else if (caseMap.containsKey(q.toLowerCase())) ans.add(caseMap.get(q.toLowerCase()));
            else if (vowelMap.containsKey(mask(q))) ans.add(vowelMap.get(mask(q)));
            else ans.add("");
        }
        return ans;
    }
    public boolean isCorrect(String[] wordlist, String[] queries, List<String> output) {
        return spellchecker(wordlist, queries).equals(output);
    }
}
