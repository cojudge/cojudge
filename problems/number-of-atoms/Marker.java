import java.util.*;
class Marker {
    public String countOfAtoms(String formula) {
        Deque<Map<String, Integer>> st = new ArrayDeque<>();
        st.push(new HashMap<>());
        int i = 0, n = formula.length();
        while (i < n) {
            char c = formula.charAt(i);
            if (c == '(') { st.push(new HashMap<>()); i++; }
            else if (c == ')') {
                i++;
                int j = i;
                while (j < n && Character.isDigit(formula.charAt(j))) j++;
                int mult = j > i ? Integer.parseInt(formula.substring(i, j)) : 1;
                i = j;
                Map<String, Integer> top = st.pop();
                Map<String, Integer> prev = st.peek();
                for (var e : top.entrySet())
                    prev.put(e.getKey(), prev.getOrDefault(e.getKey(), 0) + e.getValue() * mult);
            } else if (Character.isUpperCase(c)) {
                int j = i + 1;
                while (j < n && Character.isLowerCase(formula.charAt(j))) j++;
                String name = formula.substring(i, j);
                int k = j;
                while (k < n && Character.isDigit(formula.charAt(k))) k++;
                int cnt = k > j ? Integer.parseInt(formula.substring(j, k)) : 1;
                Map<String, Integer> cur = st.peek();
                cur.put(name, cur.getOrDefault(name, 0) + cnt);
                i = k;
            } else { i++; }
        }
        TreeMap<String, Integer> sorted = new TreeMap<>(st.pop());
        StringBuilder sb = new StringBuilder();
        for (var e : sorted.entrySet()) {
            sb.append(e.getKey());
            if (e.getValue() > 1) sb.append(e.getValue());
        }
        return sb.toString();
    }
    public boolean isCorrect(String formula, String output) {
        return countOfAtoms(formula).equals(output);
    }
}
