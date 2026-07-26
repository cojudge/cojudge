import java.util.*;

class Marker {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
        int[] indegree = new int[numCourses];
        for (int[] prerequisite : prerequisites) {
            graph.get(prerequisite[1]).add(prerequisite[0]);
            indegree[prerequisite[0]]++;
        }

        Deque<Integer> ready = new ArrayDeque<>();
        for (int course = 0; course < numCourses; course++) {
            if (indegree[course] == 0) ready.add(course);
        }

        int[] order = new int[numCourses];
        int size = 0;
        while (!ready.isEmpty()) {
            int course = ready.remove();
            order[size++] = course;
            for (int next : graph.get(course)) {
                if (--indegree[next] == 0) ready.add(next);
            }
        }
        return size == numCourses ? order : new int[0];
    }

    public boolean isCorrect(int numCourses, int[][] prerequisites, int[] output) {
        if (output == null) return false;
        if (output.length == 0) return findOrder(numCourses, prerequisites).length == 0;
        if (output.length != numCourses) return false;

        int[] position = new int[numCourses];
        boolean[] seen = new boolean[numCourses];
        for (int i = 0; i < output.length; i++) {
            int course = output[i];
            if (course < 0 || course >= numCourses || seen[course]) return false;
            seen[course] = true;
            position[course] = i;
        }
        for (int[] prerequisite : prerequisites) {
            if (position[prerequisite[1]] >= position[prerequisite[0]]) return false;
        }
        return true;
    }
}
