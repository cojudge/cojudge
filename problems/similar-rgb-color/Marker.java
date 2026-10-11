class Marker {
    public String similarRGB(String color) {
        String s = color.trim().toLowerCase();
        int r = Integer.parseInt(s.substring(1, 3), 16);
        int g = Integer.parseInt(s.substring(3, 5), 16);
        int b = Integer.parseInt(s.substring(5, 7), 16);
        return "#" + closest(r) + closest(g) + closest(b);
    }
    private String closest(int v) {
        int bestD = 0, bestDiff = Integer.MAX_VALUE;
        for (int d = 0; d < 16; d++) {
            int cand = d * 17;
            int diff = Math.abs(cand - v);
            if (diff < bestDiff) { bestDiff = diff; bestD = d; }
        }
        String h = Integer.toHexString(bestD);
        return h + h;
    }
    public boolean isCorrect(String color, String output) {
        if (output == null) return false;
        return similarRGB(color).equalsIgnoreCase(output.trim());
    }
}
