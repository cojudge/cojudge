class Marker {
    public String mergeAlternately(String word1, String word2) {
        StringBuilder sb = new StringBuilder();
        int i = 0, j = 0;
        while (i < word1.length() || j < word2.length()) {
            if (i < word1.length()) sb.append(word1.charAt(i++));
            if (j < word2.length()) sb.append(word2.charAt(j++));
        }
        return sb.toString();
    }
    public boolean isCorrect(String word1, String word2, String output) {
        String expected = mergeAlternately(word1, word2);
        if (expected == null && output == null) return true;
        if (expected == null || output == null) return false;
        return expected.equals(output);
    }
}
