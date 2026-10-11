class Marker {
    public boolean detectCapitalUse(String word) {
        int upper = 0;
        for (int i = 0; i < word.length(); i++) {
            if (Character.isUpperCase(word.charAt(i))) upper++;
        }
        if (upper == 0 || upper == word.length()) return true;
        return upper == 1 && Character.isUpperCase(word.charAt(0));
    }
    public boolean isCorrect(String word, boolean output) {
        return output == detectCapitalUse(word);
    }
}
