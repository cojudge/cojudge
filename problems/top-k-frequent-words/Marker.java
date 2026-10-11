import java.util.*;
class Marker {
    public List<String> topKFrequent(String[] words, int k) {
        Map<String, Integer> freq = new HashMap<>();
        for (String w : words) freq.put(w, freq.getOrDefault(w, 0) + 1);
        List<String> distinct = new ArrayList<>(freq.keySet());
        distinct.sort((a, b) -> {
            int fa = freq.get(a), fb = freq.get(b);
            if (fa != fb) return Integer.compare(fb, fa);
            return a.compareTo(b);
        });
        return new ArrayList<>(distinct.subList(0, Math.min(k, distinct.size())));
    }
    public boolean isCorrect(String[] words, int k, List<String> output) {
        return topKFrequent(words.clone(), k).equals(output);
    }
}
