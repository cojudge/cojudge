import java.util.*;
class Marker {
    public List<List<String>> runAutocomplete(String[] operations, String[] values) {
        Map<String, Integer> hot = new HashMap<>();
        String init = values[0];
        if (init != null && !init.isEmpty()) {
            for (String entry : init.split(";")) {
                if (entry.isEmpty()) continue;
                int p = entry.lastIndexOf(':');
                hot.put(entry.substring(0, p), Integer.parseInt(entry.substring(p + 1)));
            }
        }
        StringBuilder cur = new StringBuilder();
        List<List<String>> out = new ArrayList<>();
        for (int i = 1; i < operations.length; i++) {
            String c = values[i];
            if (c.equals("#")) {
                String s = cur.toString();
                hot.put(s, hot.getOrDefault(s, 0) + 1);
                cur.setLength(0);
                out.add(new ArrayList<>());
            } else {
                cur.append(c);
                String pre = cur.toString();
                List<String> cand = new ArrayList<>();
                for (String s : hot.keySet()) {
                    if (s.startsWith(pre)) cand.add(s);
                }
                cand.sort((a, b) -> {
                    int d = hot.get(b) - hot.get(a);
                    return d != 0 ? d : a.compareTo(b);
                });
                out.add(new ArrayList<>(cand.subList(0, Math.min(3, cand.size()))));
            }
        }
        return out;
    }
    public boolean isCorrect(String[] operations, String[] values, List<List<String>> output) {
        return output != null && runAutocomplete(operations, values).equals(output);
    }
}
