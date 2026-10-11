import java.util.*;
class Marker {
    public int[][] reconstructQueue(int[][] people) {
        int[][] p = new int[people.length][];
        for (int i = 0; i < people.length; i++) p[i] = people[i].clone();
        Arrays.sort(p, (a, b) -> {
            if (a[0] != b[0]) return Integer.compare(b[0], a[0]);
            return Integer.compare(a[1], b[1]);
        });
        List<int[]> line = new ArrayList<>();
        for (int[] person : p) line.add(person[1], person.clone());
        return line.toArray(new int[line.size()][]);
    }
    private boolean deepEquals(int[][] a, int[][] b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;
        for (int i = 0; i < a.length; i++) {
            if (a[i].length != b[i].length) return false;
            for (int j = 0; j < a[i].length; j++) if (a[i][j] != b[i][j]) return false;
        }
        return true;
    }
    public boolean isCorrect(int[][] people, int[][] output) {
        return deepEquals(reconstructQueue(people), output);
    }
}
