class Marker {
    public int shortestWordDistance(String[] wordsDict, String word1, String word2) {
        int best = Integer.MAX_VALUE;
        if (word1.equals(word2)) {
            int prev = -1;
            for (int i = 0; i < wordsDict.length; i++) {
                if (wordsDict[i].equals(word1)) {
                    if (prev != -1) best = Math.min(best, i - prev);
                    prev = i;
                }
            }
        } else {
            int i1 = -1, i2 = -1;
            for (int i = 0; i < wordsDict.length; i++) {
                if (wordsDict[i].equals(word1)) i1 = i;
                if (wordsDict[i].equals(word2)) i2 = i;
                if (i1 != -1 && i2 != -1) best = Math.min(best, Math.abs(i1 - i2));
            }
        }
        return best;
    }

    public boolean isCorrect(String[] wordsDict, String word1, String word2, int output) {
        return output == shortestWordDistance(wordsDict, word1, word2);
    }
}
