class Marker {
    public int brokenCalc(int startValue, int target) {
        int ops = 0;
        while (target > startValue) {
            ops++;
            if (target % 2 == 1) {
                target++;
            } else {
                target /= 2;
            }
        }
        return ops + (startValue - target);
    }
    public boolean isCorrect(int startValue, int target, int output) {
        return brokenCalc(startValue, target) == output;
    }
}
