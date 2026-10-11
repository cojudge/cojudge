class Marker {
    private boolean isVowel(char c) {
        return "aeiouAEIOU".indexOf(c) >= 0;
    }
    public String reverseVowels(String s) {
        char[] a = s.toCharArray();
        int i = 0, j = a.length - 1;
        while (i < j) {
            while (i < j && !isVowel(a[i])) i++;
            while (i < j && !isVowel(a[j])) j--;
            if (i < j) {
                char t = a[i]; a[i] = a[j]; a[j] = t;
                i++; j--;
            }
        }
        return new String(a);
    }
    public boolean isCorrect(String s, String output) {
        return reverseVowels(s).equals(output);
    }
}
