class Marker {
    public boolean checkValidString(String s) {
        int minimumOpen = 0;
        int maximumOpen = 0;

        for (int i = 0; i < s.length(); i++) {
            char character = s.charAt(i);
            if (character == '(') {
                minimumOpen++;
                maximumOpen++;
            } else if (character == ')') {
                minimumOpen--;
                maximumOpen--;
            } else {
                minimumOpen--;
                maximumOpen++;
            }

            if (maximumOpen < 0) return false;
            minimumOpen = Math.max(minimumOpen, 0);
        }
        return minimumOpen == 0;
    }

    public boolean isCorrect(String s, boolean output) {
        return checkValidString(s) == output;
    }
}
