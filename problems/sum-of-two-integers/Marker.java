class Marker {
    // Sum without using + or - using bitwise operations
    public int getSum(int a, int b) {
        while (b != 0) {
            int carry = (a & b) << 1;
            a = a ^ b;
            b = carry;
        }
        return a;
    }

    public boolean isCorrect(int a, int b, int output) {
        return getSum(a, b) == output;
    }
}
