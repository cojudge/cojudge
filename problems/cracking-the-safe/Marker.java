import java.util.*;
class Marker {
    public String crackSafe(int n, int k) {
        if (n == 1) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < k; i++) sb.append((char)('0' + i));
            return sb.toString();
        }
        StringBuilder st = new StringBuilder();
        for (int i = 0; i < n - 1; i++) st.append('0');
        String start = st.toString();
        Set<String> seen = new HashSet<>();
        Map<String, Integer> ptr = new HashMap<>();
        Deque<String> nodeStack = new ArrayDeque<>();
        Deque<Integer> inStack = new ArrayDeque<>();
        nodeStack.push(start);
        inStack.push(-1);
        StringBuilder circuit = new StringBuilder();
        while (!nodeStack.isEmpty()) {
            String node = nodeStack.peek();
            int idx = ptr.getOrDefault(node, 0);
            if (idx < k) {
                ptr.put(node, idx + 1);
                String nei = node + (char)('0' + idx);
                if (!seen.contains(nei)) {
                    seen.add(nei);
                    nodeStack.push(nei.substring(1));
                    inStack.push(idx);
                }
            } else {
                nodeStack.pop();
                int ind = inStack.pop();
                if (ind != -1) circuit.append((char)('0' + ind));
            }
        }
        circuit.append(start);
        return circuit.toString();
    }
    public boolean isCorrect(int n, int k, String output) {
        if (output == null) return false;
        int total = (int) Math.pow(k, n);
        if (output.length() != total + n - 1) return false;
        for (int i = 0; i < output.length(); i++) {
            char c = output.charAt(i);
            if (c < '0' || c >= '0' + k) return false;
        }
        Set<String> s = new HashSet<>();
        for (int i = 0; i + n <= output.length(); i++) s.add(output.substring(i, i + n));
        return s.size() == total;
    }
}
