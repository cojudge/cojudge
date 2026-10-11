import java.util.*;
class Marker {
    public List<String> subdomainVisits(String[] cpdomains) {
        Map<String, Integer> map = new HashMap<>();
        for (String e : cpdomains) {
            int sp = e.indexOf(' ');
            int cnt = Integer.parseInt(e.substring(0, sp));
            String dom = e.substring(sp + 1);
            String[] parts = dom.split("\\.");
            StringBuilder sb = new StringBuilder();
            for (int i = parts.length - 1; i >= 0; i--) {
                if (sb.length() == 0) sb.insert(0, parts[i]);
                else sb.insert(0, parts[i] + ".");
                String key = sb.toString();
                map.put(key, map.getOrDefault(key, 0) + cnt);
            }
        }
        List<String> res = new ArrayList<>();
        for (Map.Entry<String, Integer> en : map.entrySet()) res.add(en.getValue() + " " + en.getKey());
        return res;
    }
    private List<String> norm(List<String> l) {
        List<String> c = new ArrayList<>(l);
        Collections.sort(c);
        return c;
    }
    public boolean isCorrect(String[] cpdomains, List<String> output) {
        if (output == null) return false;
        return norm(subdomainVisits(cpdomains)).equals(norm(output));
    }
}
