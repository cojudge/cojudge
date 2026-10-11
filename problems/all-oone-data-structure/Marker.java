import java.util.*;
class Marker {
    static class AllOne {
        Map<String, Integer> cnt = new HashMap<>();
        TreeMap<Integer, LinkedHashSet<String>> buckets = new TreeMap<>();
        public void inc(String key) {
            int c = cnt.getOrDefault(key, 0);
            if (c > 0) {
                LinkedHashSet<String> s = buckets.get(c);
                s.remove(key);
                if (s.isEmpty()) buckets.remove(c);
            }
            cnt.put(key, c + 1);
            buckets.computeIfAbsent(c + 1, k -> new LinkedHashSet<>()).add(key);
        }
        public void dec(String key) {
            int c = cnt.get(key);
            LinkedHashSet<String> s = buckets.get(c);
            s.remove(key);
            if (s.isEmpty()) buckets.remove(c);
            if (c == 1) cnt.remove(key);
            else {
                cnt.put(key, c - 1);
                buckets.computeIfAbsent(c - 1, k -> new LinkedHashSet<>()).add(key);
            }
        }
        public String getMaxKey() {
            if (buckets.isEmpty()) return "";
            return buckets.lastEntry().getValue().iterator().next();
        }
        public String getMinKey() {
            if (buckets.isEmpty()) return "";
            return buckets.firstEntry().getValue().iterator().next();
        }
    }
    public List<String> runAllOne(String[] operations, String[] values) {
        List<String> res = new ArrayList<>();
        AllOne obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            String v = i < values.length ? values[i] : "";
            if (op.equals("AllOne")) {
                obj = new AllOne();
                res.add("null");
            } else if (op.equals("inc")) {
                obj.inc(v);
                res.add("null");
            } else if (op.equals("dec")) {
                obj.dec(v);
                res.add("null");
            } else if (op.equals("getMaxKey")) {
                res.add(obj.getMaxKey());
            } else if (op.equals("getMinKey")) {
                res.add(obj.getMinKey());
            } else {
                res.add("null");
            }
        }
        return res;
    }
    public boolean isCorrect(String[] operations, String[] values, List<String> output) {
        if (output == null || output.size() != operations.length) return false;
        AllOne ref = new AllOne();
        AllOne shadow = null;
        // Replay with tie-aware checking for min/max.
        Map<String, Integer> counts = new HashMap<>();
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            String v = i < values.length ? values[i] : "";
            String got = output.get(i);
            if (op.equals("AllOne")) {
                counts.clear();
                if (!got.equals("null")) return false;
            } else if (op.equals("inc")) {
                counts.put(v, counts.getOrDefault(v, 0) + 1);
                if (!got.equals("null")) return false;
            } else if (op.equals("dec")) {
                int c = counts.getOrDefault(v, 0);
                if (c <= 1) counts.remove(v);
                else counts.put(v, c - 1);
                if (!got.equals("null")) return false;
            } else if (op.equals("getMaxKey")) {
                if (counts.isEmpty()) {
                    if (!got.equals("")) return false;
                } else {
                    int mx = Collections.max(counts.values());
                    if (got.equals("")) return false;
                    Integer gc = counts.get(got);
                    if (gc == null || gc != mx) return false;
                }
            } else if (op.equals("getMinKey")) {
                if (counts.isEmpty()) {
                    if (!got.equals("")) return false;
                } else {
                    int mn = Collections.min(counts.values());
                    if (got.equals("")) return false;
                    Integer gc = counts.get(got);
                    if (gc == null || gc != mn) return false;
                }
            }
        }
        return true;
    }
}
