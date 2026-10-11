import java.util.*;
class Marker {
    public int[] runMaxStack(String[] operations, int[] values) {
        List<Integer> st = new ArrayList<>();
        List<Integer> ans = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("push")) st.add(values[i]);
            else if (op.equals("pop")) ans.add(st.remove(st.size() - 1));
            else if (op.equals("top")) ans.add(st.get(st.size() - 1));
            else if (op.equals("peekMax")) {
                int mx = Collections.max(st);
                ans.add(mx);
            } else if (op.equals("popMax")) {
                int mx = Collections.max(st);
                int idx = st.lastIndexOf(mx);
                st.remove(idx);
                ans.add(mx);
            } else throw new IllegalArgumentException("Unknown op " + op);
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, int[] values, int[] output) {
        return output != null && Arrays.equals(runMaxStack(operations, values), output);
    }
}
