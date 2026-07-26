import java.util.Arrays;

class Marker {
    public int[] plusOne(int[] digits) {
        int[] result = digits.clone();
        for (int i = result.length - 1; i >= 0; i--) {
            if (result[i] < 9) {
                result[i]++;
                return result;
            }
            result[i] = 0;
        }

        int[] expanded = new int[result.length + 1];
        expanded[0] = 1;
        return expanded;
    }

    public boolean isCorrect(int[] digits, int[] output) {
        return Arrays.equals(plusOne(digits), output);
    }
}
