class Marker {
    public int minDistance(String word1, String word2) {
        if (word1.length() < word2.length()) {
            String temporary = word1;
            word1 = word2;
            word2 = temporary;
        }

        int[] previous = new int[word2.length() + 1];
        for (int j = 0; j <= word2.length(); j++) previous[j] = j;

        for (int i = 1; i <= word1.length(); i++) {
            int[] current = new int[word2.length() + 1];
            current[0] = i;
            for (int j = 1; j <= word2.length(); j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    current[j] = previous[j - 1];
                } else {
                    current[j] = 1 + Math.min(previous[j - 1],
                            Math.min(previous[j], current[j - 1]));
                }
            }
            previous = current;
        }
        return previous[word2.length()];
    }

    public boolean isCorrect(String word1, String word2, int output) {
        return output == minDistance(word1, word2);
    }
}
