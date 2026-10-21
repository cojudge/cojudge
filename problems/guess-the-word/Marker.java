class Marker {
    public boolean isCorrect(String[] wordlist, String secret, String transcript) {
        if (transcript == null) return false;
        String t = transcript.trim();
        if (!t.startsWith("solved:")) return false;
        try {
            int n = Integer.parseInt(t.substring("solved:".length()).trim());
            return n >= 1 && n <= 10;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
