class Marker {
    public String reverseStr(String s, int k) {
        char[] a = s.toCharArray();
        for (int start = 0; start < a.length; start += 2 * k) {
            int i = start, j = Math.min(start + k - 1, a.length - 1);
            while (i < j) {
                char t = a[i]; a[i] = a[j]; a[j] = t;
                i++; j--;
            }
        }
        return new String(a);
    }
    public boolean isCorrect(String s, int k, String output) {
        return reverseStr(s, k).equals(output);
    }
}
