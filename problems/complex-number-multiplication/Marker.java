import java.util.*;
class Marker {
    private int[] parse(String s) {
        int plus = s.indexOf('+');
        int real = Integer.parseInt(s.substring(0, plus));
        int imag = Integer.parseInt(s.substring(plus + 1, s.length() - 1));
        return new int[]{real, imag};
    }
    public String complexNumberMultiply(String num1, String num2) {
        int[] a = parse(num1), b = parse(num2);
        int real = a[0] * b[0] - a[1] * b[1];
        int imag = a[0] * b[1] + a[1] * b[0];
        return real + "+" + imag + "i";
    }
    public boolean isCorrect(String num1, String num2, String output) {
        return complexNumberMultiply(num1, num2).equals(output);
    }
}
