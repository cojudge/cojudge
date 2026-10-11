import java.util.*;
class Marker {
    public boolean canVisitAllRooms(int[][] rooms) {
        int n = rooms.length;
        boolean[] seen = new boolean[n];
        Deque<Integer> st = new ArrayDeque<>();
        st.push(0);
        seen[0] = true;
        while (!st.isEmpty()) {
            int u = st.pop();
            for (int v : rooms[u]) {
                if (!seen[v]) {
                    seen[v] = true;
                    st.push(v);
                }
            }
        }
        for (boolean b : seen) if (!b) return false;
        return true;
    }
    public boolean isCorrect(int[][] rooms, boolean output) {
        return canVisitAllRooms(rooms) == output;
    }
}
