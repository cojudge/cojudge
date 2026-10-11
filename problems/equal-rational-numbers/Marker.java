import java.util.*;
import java.math.BigInteger;
class Marker {
    public boolean isRationalEqual(String s, String t) {
        BigInteger[] a = parseRational(s);
        BigInteger[] b = parseRational(t);
        return a[0].multiply(b[1]).equals(b[0].multiply(a[1]));
    }
    private BigInteger[] parseRational(String s) {
        int dot = s.indexOf('.');
        String intPart;
        String frac = "";
        if (dot < 0) {
            int paren = s.indexOf('(');
            if (paren < 0) { intPart = s; } else { intPart = s.substring(0, paren); }
        } else {
            intPart = s.substring(0, dot);
            frac = s.substring(dot + 1);
        }
        if (intPart.isEmpty()) intPart = "0";
        String nonRep = "";
        String rep = "";
        int open = frac.indexOf('(');
        if (open >= 0) {
            nonRep = frac.substring(0, open);
            int close = frac.indexOf(')', open);
            rep = frac.substring(open + 1, close);
        } else {
            nonRep = frac;
        }
        BigInteger ip = new BigInteger(intPart);
        int a = nonRep.length();
        int b = rep.length();
        BigInteger powA = BigInteger.TEN.pow(a);
        if (b == 0) {
            BigInteger num;
            if (a == 0) { num = ip; }
            else { num = ip.multiply(powA).add(new BigInteger(nonRep)); }
            BigInteger den = powA.max(BigInteger.ONE);
            return new BigInteger[]{num, den};
        }
        BigInteger powB = BigInteger.TEN.pow(b);
        BigInteger bMinus1 = powB.subtract(BigInteger.ONE);
        BigInteger den = powA.multiply(bMinus1);
        BigInteger nr = nonRep.isEmpty() ? BigInteger.ZERO : new BigInteger(nonRep);
        BigInteger r = rep.isEmpty() ? BigInteger.ZERO : new BigInteger(rep);
        BigInteger num = ip.multiply(den).add(nr.multiply(bMinus1)).add(r);
        return new BigInteger[]{num, den};
    }
    public boolean isCorrect(String s, String t, boolean output) {
        return isRationalEqual(s, t) == output;
    }
}
