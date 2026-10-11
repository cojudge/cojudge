class Marker {
    public String validIPAddress(String queryIP) {
        if (isIPv4(queryIP)) return "IPv4";
        if (isIPv6(queryIP)) return "IPv6";
        return "Neither";
    }
    private boolean isIPv4(String ip) {
        String[] g = ip.split("\\.", -1);
        if (g.length != 4) return false;
        for (String p : g) {
            if (p.length() == 0 || p.length() > 3) return false;
            if (p.length() > 1 && p.charAt(0) == '0') return false;
            for (char c : p.toCharArray()) if (!Character.isDigit(c)) return false;
            if (Integer.parseInt(p) > 255) return false;
        }
        return true;
    }
    private boolean isIPv6(String ip) {
        String[] g = ip.split(":", -1);
        if (g.length != 8) return false;
        String hex = "0123456789abcdefABCDEF";
        for (String p : g) {
            if (p.length() == 0 || p.length() > 4) return false;
            for (char c : p.toCharArray()) if (hex.indexOf(c) < 0) return false;
        }
        return true;
    }
    public boolean isCorrect(String queryIP, String output) {
        return validIPAddress(queryIP).equals(output);
    }
}
