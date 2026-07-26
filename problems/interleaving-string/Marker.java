class Marker {
    public boolean isInterleave(String s1, String s2, String s3) {
        if (s1.length() + s2.length() != s3.length()) return false;

        boolean[] possible = new boolean[s2.length() + 1];
        possible[0] = true;
        for (int j = 1; j <= s2.length(); j++) {
            possible[j] = possible[j - 1]
                    && s2.charAt(j - 1) == s3.charAt(j - 1);
        }
        for (int i = 1; i <= s1.length(); i++) {
            possible[0] = possible[0]
                    && s1.charAt(i - 1) == s3.charAt(i - 1);
            for (int j = 1; j <= s2.length(); j++) {
                char next = s3.charAt(i + j - 1);
                possible[j] = (possible[j] && s1.charAt(i - 1) == next)
                        || (possible[j - 1] && s2.charAt(j - 1) == next);
            }
        }
        return possible[s2.length()];
    }

    public boolean isCorrect(String s1, String s2, String s3, boolean output) {
        return output == isInterleave(s1, s2, s3);
    }
}
