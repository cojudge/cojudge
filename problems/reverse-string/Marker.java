class Marker {
    public String reverseString(String s) {
        if (s == null) return null;
        return new StringBuilder(s).reverse().toString();
    }
    public boolean isCorrect(String s, String output) {
        String expected = reverseString(s);
        if (expected == null && output == null) return true;
        if (expected == null || output == null) return false;
        return expected.equals(output);
    }
}
