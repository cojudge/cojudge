class Marker {
    public boolean checkRecord(String s) {
        int absent = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == 'A') {
                absent++;
                if (absent >= 2) return false;
            }
            if (i + 2 < s.length() && s.charAt(i) == 'L' && s.charAt(i + 1) == 'L' && s.charAt(i + 2) == 'L') return false;
        }
        return true;
    }
    public boolean isCorrect(String s, boolean output) {
        return checkRecord(s) == output;
    }
}
