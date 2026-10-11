class Marker {
    public String countAndSay(int n) {
        String cur = "1";
        for (int i = 1; i < n; i++) {
            StringBuilder sb = new StringBuilder();
            int count = 1;
            for (int j = 1; j <= cur.length(); j++) {
                if (j < cur.length() && cur.charAt(j) == cur.charAt(j - 1)) {
                    count++;
                } else {
                    sb.append(count).append(cur.charAt(j - 1));
                    count = 1;
                }
            }
            cur = sb.toString();
        }
        return cur;
    }
    public boolean isCorrect(int n, String output) {
        return countAndSay(n).equals(output);
    }
}
