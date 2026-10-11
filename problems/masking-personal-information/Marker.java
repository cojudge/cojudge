class Marker {
    public String maskPII(String s) {
        if (s.contains("@")) {
            String lower = s.toLowerCase();
            int at = lower.indexOf('@');
            String name = lower.substring(0, at);
            String domain = lower.substring(at + 1);
            return name.charAt(0) + "*****" + name.charAt(name.length() - 1) + "@" + domain;
        }
        StringBuilder digits = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) digits.append(c);
        }
        String d = digits.toString();
        String last4 = d.substring(d.length() - 4);
        if (d.length() == 10) return "***-***-" + last4;
        StringBuilder sb = new StringBuilder("+");
        for (int i = 0; i < d.length() - 10; i++) sb.append('*');
        sb.append("-***-***-").append(last4);
        return sb.toString();
    }
    public boolean isCorrect(String s, String output) {
        return maskPII(s).equals(output);
    }
}
