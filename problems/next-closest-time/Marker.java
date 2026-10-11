import java.util.*;
class Marker {
    public String nextClosestTime(String time) {
        Set<Character> allowed = new HashSet<>();
        for (char c : time.toCharArray()) if (c != ':') allowed.add(c);
        int cur = Integer.parseInt(time.substring(0,2)) * 60 + Integer.parseInt(time.substring(3));
        for (int d = 1; d <= 24*60; d++) {
            int nxt = (cur + d) % (24*60);
            String cand = String.format("%02d:%02d", nxt / 60, nxt % 60);
            boolean ok = true;
            for (char c : cand.toCharArray()) {
                if (c == ':') continue;
                if (!allowed.contains(c)) { ok = false; break; }
            }
            if (ok) return cand;
        }
        return time;
    }
    public boolean isCorrect(String time, String output) {
        return nextClosestTime(time).equals(output);
    }
}
