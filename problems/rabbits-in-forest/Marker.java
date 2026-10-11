import java.util.*;
class Marker {
    public int numRabbits(int[] answers) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int a : answers) freq.put(a, freq.getOrDefault(a, 0) + 1);
        int total = 0;
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            int a = e.getKey();
            int c = e.getValue();
            int size = a + 1;
            int groups = (c + size - 1) / size;
            total += groups * size;
        }
        return total;
    }
    public boolean isCorrect(int[] answers, int output) {
        return numRabbits(answers) == output;
    }
}
