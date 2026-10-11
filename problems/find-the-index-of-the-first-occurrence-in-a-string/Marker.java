class Marker {
    public int strStr(String haystack, String needle) {
        return haystack.indexOf(needle);
    }
    public boolean isCorrect(String haystack, String needle, int output) {
        return strStr(haystack, needle) == output;
    }
}
