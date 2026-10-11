class Marker {
    public String getHint(String secret, String guess) {
        int bulls = 0;
        int[] s = new int[10];
        int[] g = new int[10];
        for (int i = 0; i < secret.length(); i++) {
            char a = secret.charAt(i), b = guess.charAt(i);
            if (a == b) bulls++;
            else { s[a - '0']++; g[b - '0']++; }
        }
        int cows = 0;
        for (int d = 0; d < 10; d++) cows += Math.min(s[d], g[d]);
        return bulls + "A" + cows + "B";
    }
    public boolean isCorrect(String secret, String guess, String output) {
        return getHint(secret, guess).equals(output);
    }
}
