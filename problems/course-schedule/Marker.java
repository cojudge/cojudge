import java.util.*;
class Marker {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        int[] indeg = new int[numCourses];
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) g.add(new ArrayList<>());
        for (int[] p : prerequisites) {
            int a = p[0], b = p[1];
            g.get(b).add(a);
            indeg[a]++;
        }
        Deque<Integer> dq = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) dq.add(i);
        int seen = 0;
        while (!dq.isEmpty()) {
            int u = dq.poll();
            seen++;
            for (int v : g.get(u)) {
                if (--indeg[v] == 0) dq.add(v);
            }
        }
        return seen == numCourses;
    }
    public boolean isCorrect(int numCourses, int[][] prerequisites, boolean output) {
        return canFinish(numCourses, prerequisites) == output;
    }
}
