class Marker {
    public String multiply(String num1, String num2) {
        if (num1.equals("0") || num2.equals("0")) return "0";

        int[] digits = new int[num1.length() + num2.length()];
        for (int i = num1.length() - 1; i >= 0; i--) {
            int left = num1.charAt(i) - '0';
            for (int j = num2.length() - 1; j >= 0; j--) {
                int position = i + j + 1;
                int value = left * (num2.charAt(j) - '0') + digits[position];
                digits[position] = value % 10;
                digits[position - 1] += value / 10;
            }
        }

        StringBuilder result = new StringBuilder(digits.length);
        int index = digits[0] == 0 ? 1 : 0;
        while (index < digits.length) result.append(digits[index++]);
        return result.toString();
    }

    public boolean isCorrect(String num1, String num2, String output) {
        return multiply(num1, num2).equals(output);
    }
}
