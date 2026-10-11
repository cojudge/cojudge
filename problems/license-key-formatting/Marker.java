class Marker {
    public String licenseKeyFormatting(String s, int k) {
        StringBuilder clean = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '-') continue;
            clean.append(Character.toUpperCase(c));
        }
        if (clean.length() == 0) return "";
        StringBuilder out = new StringBuilder();
        int count = 0;
        for (int i = clean.length() - 1; i >= 0; i--) {
            out.append(clean.charAt(i));
            count++;
            if (count == k && i != 0) {
                out.append('-');
                count = 0;
            }
        }
        return out.reverse().toString();
    }
    public boolean isCorrect(String s, int k, String output) {
        return licenseKeyFormatting(s, k).equals(output);
    }
}
