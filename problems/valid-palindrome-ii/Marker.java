class Marker {
    private boolean isRangePalindrome(String s, int i, int j) {
        while (i < j) {
            if (s.charAt(i) != s.charAt(j)) return false;
            i++; j--;
        }
        return true;
    }
    public boolean validPalindrome(String s) {
        int i = 0, j = s.length() - 1;
        while (i < j) {
            if (s.charAt(i) != s.charAt(j)) {
                return isRangePalindrome(s, i + 1, j) || isRangePalindrome(s, i, j - 1);
            }
            i++; j--;
        }
        return true;
    }
    public boolean isCorrect(String s, boolean output) {
        return output == validPalindrome(s);
    }
}
