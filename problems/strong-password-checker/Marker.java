import java.util.*;
class Marker {
    public int strongPasswordChecker(String password) {
        int n = password.length();
        boolean lower = false, upper = false, digit = false;
        for (int i = 0; i < n; i++) {
            char c = password.charAt(i);
            if (c >= 'a' && c <= 'z') lower = true;
            else if (c >= 'A' && c <= 'Z') upper = true;
            else if (c >= '0' && c <= '9') digit = true;
        }
        int missing = (lower ? 0 : 1) + (upper ? 0 : 1) + (digit ? 0 : 1);
        List<Integer> runs = new ArrayList<>();
        int i = 0;
        while (i < n) {
            int j = i;
            while (j < n && password.charAt(j) == password.charAt(i)) j++;
            int len = j - i;
            if (len >= 3) runs.add(len);
            i = j;
        }
        if (n < 6) return Math.max(missing, 6 - n);
        int replace = 0;
        for (int len : runs) replace += len / 3;
        if (n <= 20) return Math.max(missing, replace);
        int del = n - 20;
        int left = del;
        // prioritize runs with len % 3 == 0 (1 del saves 1 replace)
        Collections.sort(runs, (a, b) -> Integer.compare(a % 3, b % 3));
        for (int k = 0; k < runs.size() && left > 0; k++) {
            int len = runs.get(k);
            if (len < 3) continue;
            int mod = len % 3;
            int need = mod == 0 ? 1 : (mod == 1 ? 2 : 3);
            int use = Math.min(need, Math.min(left, len - 2));
            runs.set(k, len - use);
            left -= use;
        }
        replace = 0;
        for (int len : runs) replace += len / 3;
        // any leftover deletions further reduce replacements
        replace -= left / 3;
        if (replace < 0) replace = 0;
        return del + Math.max(missing, replace);
    }
    public boolean isCorrect(String password, int output) {
        return strongPasswordChecker(password) == output;
    }
}
