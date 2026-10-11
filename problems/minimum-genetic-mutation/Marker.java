import java.util.*;
class Marker {
    private boolean oneAway(String a, String b) {
        int d = 0;
        for (int i = 0; i < a.length(); i++) {
            if (a.charAt(i) != b.charAt(i)) {
                d++;
                if (d > 1) return false;
            }
        }
        return d == 1;
    }
    public int minMutation(String startGene, String endGene, String[] bank) {
        Set<String> bankSet = new HashSet<>(Arrays.asList(bank));
        if (!bankSet.contains(endGene)) return -1;
        Queue<String> q = new LinkedList<>();
        Set<String> seen = new HashSet<>();
        q.add(startGene);
        seen.add(startGene);
        int steps = 0;
        while (!q.isEmpty()) {
            int sz = q.size();
            for (int k = 0; k < sz; k++) {
                String cur = q.poll();
                if (cur.equals(endGene)) return steps;
                for (String nb : bank) {
                    if (!seen.contains(nb) && oneAway(cur, nb)) {
                        seen.add(nb);
                        q.add(nb);
                    }
                }
            }
            steps++;
        }
        return -1;
    }
    public boolean isCorrect(String startGene, String endGene, String[] bank, int output) {
        return output == minMutation(startGene, endGene, bank);
    }
}
