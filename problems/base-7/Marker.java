class Marker {
    public String convertToBase7(int num) {
        if (num == 0) return "0";
        boolean neg = num < 0;
        long n = Math.abs((long) num);
        StringBuilder sb = new StringBuilder();
        while (n > 0) {
            sb.append(n % 7);
            n /= 7;
        }
        if (neg) sb.append('-');
        return sb.reverse().toString();
    }
    public boolean isCorrect(int num, String output) {
        return convertToBase7(num).equals(output);
    }
}
