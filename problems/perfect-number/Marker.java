class Marker {
    public boolean checkPerfectNumber(int num) {
        if (num <= 1) return false;
        int sum = 1;
        for (int d = 2; (long) d * d <= num; d++) {
            if (num % d == 0) {
                sum += d;
                int other = num / d;
                if (other != d) sum += other;
                if (sum > num) return false;
            }
        }
        return sum == num;
    }
    public boolean isCorrect(int num, boolean output) {
        return output == checkPerfectNumber(num);
    }
}
