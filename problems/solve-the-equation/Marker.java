import java.util.*;
class Marker {
    private int[] parseSide(String s) {
        int coeff = 0, con = 0, i = 0, n = s.length();
        while (i < n) {
            int sign = 1;
            if (s.charAt(i) == '+') { sign = 1; i++; }
            else if (s.charAt(i) == '-') { sign = -1; i++; }
            int num = 0;
            boolean hasNum = false;
            while (i < n && Character.isDigit(s.charAt(i))) {
                num = num * 10 + (s.charAt(i) - '0');
                i++;
                hasNum = true;
            }
            boolean isX = i < n && s.charAt(i) == 'x';
            if (isX) {
                coeff += sign * (hasNum ? num : 1);
                i++;
            } else {
                con += sign * num;
            }
        }
        return new int[]{coeff, con};
    }
    public String solveEquation(String equation) {
        int eq = equation.indexOf('=');
        int[] L = parseSide(equation.substring(0, eq));
        int[] R = parseSide(equation.substring(eq + 1));
        int cx = L[0] - R[0];
        int cc = R[1] - L[1];
        if (cx == 0) return cc == 0 ? "Infinite solutions" : "No solution";
        return "x=" + (cc / cx);
    }
    public boolean isCorrect(String equation, String output) {
        return solveEquation(equation).equals(output);
    }
}
