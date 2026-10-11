class Marker {
    private static final String[] BELOW_20 = {"", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"};
    private static final String[] TENS = {"", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"};

    public String numberToWords(int num) {
        if (num == 0) return "Zero";
        StringBuilder sb = new StringBuilder();
        appendScale(sb, num / 1000000000, "Billion");
        appendScale(sb, (num / 1000000) % 1000, "Million");
        appendScale(sb, (num / 1000) % 1000, "Thousand");
        String rest = belowThousand(num % 1000);
        if (!rest.isEmpty()) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(rest);
        }
        return sb.toString();
    }

    private void appendScale(StringBuilder sb, int chunk, String scale) {
        if (chunk == 0) return;
        if (sb.length() > 0) sb.append(" ");
        sb.append(belowThousand(chunk)).append(" ").append(scale);
    }

    private String belowThousand(int n) {
        StringBuilder sb = new StringBuilder();
        if (n >= 100) {
            sb.append(BELOW_20[n / 100]).append(" Hundred");
            n %= 100;
            if (n > 0) sb.append(" ");
        }
        if (n >= 20) {
            sb.append(TENS[n / 10]);
            if (n % 10 > 0) sb.append(" ").append(BELOW_20[n % 10]);
        } else if (n > 0) {
            sb.append(BELOW_20[n]);
        }
        return sb.toString();
    }

    public boolean isCorrect(int num, String output) {
        return numberToWords(num).equals(output);
    }
}
