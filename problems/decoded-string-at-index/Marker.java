class Marker {
    public String decodeAtIndex(String s, int k) {
        long size = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) size *= (c - '0');
            else size++;
        }
        long kk = k;
        for (int i = s.length() - 1; i >= 0; i--) {
            char c = s.charAt(i);
            kk %= size;
            if (kk == 0 && Character.isLetter(c)) return String.valueOf(c);
            if (Character.isDigit(c)) size /= (c - '0');
            else size--;
        }
        return "";
    }
    public boolean isCorrect(String s, int k, String output) {
        return decodeAtIndex(s, k).equals(output);
    }
}
