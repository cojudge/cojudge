class Marker {
    public String shiftingLetters(String s, int[] shifts) {
        int n = s.length();
        char[] a = s.toCharArray();
        long acc = 0;
        for (int i = n - 1; i >= 0; i--) {
            acc = (acc + shifts[i]) % 26;
            a[i] = (char) ('a' + (a[i] - 'a' + acc) % 26);
        }
        return new String(a);
    }
    public boolean isCorrect(String s, int[] shifts, String output) {
        return shiftingLetters(s, shifts).equals(output);
    }
}
