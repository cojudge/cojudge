import java.util.*;
class Marker {
    public List<Integer> killProcess(int[] pid, int[] ppid, int kill) {
        Map<Integer, List<Integer>> children = new HashMap<>();
        for (int i = 0; i < pid.length; i++) {
            children.computeIfAbsent(ppid[i], k -> new ArrayList<>()).add(pid[i]);
        }
        List<Integer> ans = new ArrayList<>();
        Deque<Integer> q = new ArrayDeque<>();
        q.add(kill);
        while (!q.isEmpty()) {
            int cur = q.poll();
            ans.add(cur);
            List<Integer> ch = children.get(cur);
            if (ch != null) for (int c : ch) q.add(c);
        }
        return ans;
    }
    public boolean isCorrect(int[] pid, int[] ppid, int kill, List<Integer> output) {
        if (output == null) return false;
        List<Integer> exp = killProcess(pid, ppid, kill);
        if (exp.size() != output.size()) return false;
        List<Integer> a = new ArrayList<>(exp);
        List<Integer> b = new ArrayList<>(output);
        Collections.sort(a);
        Collections.sort(b);
        return a.equals(b);
    }
}
