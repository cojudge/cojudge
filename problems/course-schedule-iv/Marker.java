import java.util.*;
class Marker {
    // Return as List<String> of "true"/"false" to match string_list outputType
    public List<String> checkIfPrerequisite(int numCourses, int[][] prerequisites, int[][] queries) {
        boolean[][] reach = new boolean[numCourses][numCourses];
        for (int[] p : prerequisites) reach[p[0]][p[1]] = true;
        for (int k = 0; k < numCourses; k++)
            for (int i = 0; i < numCourses; i++)
                if (reach[i][k])
                    for (int j = 0; j < numCourses; j++)
                        if (reach[k][j]) reach[i][j] = true;
        List<String> ans = new ArrayList<>();
        for (int[] q : queries) ans.add(reach[q[0]][q[1]] ? "true" : "false");
        return ans;
    }
    public boolean isCorrect(int numCourses, int[][] prerequisites, int[][] queries, List<String> output) {
        return checkIfPrerequisite(numCourses, prerequisites, queries).equals(output);
    }
}
