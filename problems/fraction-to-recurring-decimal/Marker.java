import java.util.*;
class Marker {
    public String fractionToDecimal(int numerator, int denominator) {
        if (numerator == 0) return "0";
        StringBuilder sb = new StringBuilder();
        if ((numerator < 0) ^ (denominator < 0)) sb.append("-");
        long num = Math.abs((long) numerator);
        long den = Math.abs((long) denominator);
        sb.append(num / den);
        long rem = num % den;
        if (rem == 0) return sb.toString();
        sb.append(".");
        Map<Long, Integer> pos = new HashMap<>();
        while (rem != 0) {
            if (pos.containsKey(rem)) {
                int at = pos.get(rem);
                sb.insert(at, "(");
                sb.append(")");
                break;
            }
            pos.put(rem, sb.length());
            rem *= 10;
            sb.append(rem / den);
            rem %= den;
        }
        return sb.toString();
    }
    public boolean isCorrect(int numerator, int denominator, String output) {
        return fractionToDecimal(numerator, denominator).equals(output);
    }
}
