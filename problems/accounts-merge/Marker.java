import java.util.*;
class Marker {
    public List<List<String>> accountsMerge(List<List<String>> accounts) {
        Map<String, String> parent = new HashMap<>();
        Map<String, String> emailToName = new HashMap<>();
        for (List<String> acc : accounts) {
            String name = acc.get(0);
            for (int i = 1; i < acc.size(); i++) {
                String email = acc.get(i);
                parent.putIfAbsent(email, email);
                emailToName.put(email, name);
                union(parent, acc.get(1), email);
            }
        }
        Map<String, TreeSet<String>> groups = new HashMap<>();
        for (String email : parent.keySet()) {
            String root = find(parent, email);
            groups.computeIfAbsent(root, k -> new TreeSet<>()).add(email);
        }
        List<List<String>> res = new ArrayList<>();
        for (Map.Entry<String, TreeSet<String>> e : groups.entrySet()) {
            List<String> acc = new ArrayList<>();
            acc.add(emailToName.get(e.getKey()));
            acc.addAll(e.getValue());
            res.add(acc);
        }
        res.sort((a, b) -> {
            int c = a.get(0).compareTo(b.get(0));
            if (c != 0) return c;
            return a.get(1).compareTo(b.get(1));
        });
        return res;
    }
    private String find(Map<String, String> p, String x) {
        if (!p.get(x).equals(x)) p.put(x, find(p, p.get(x)));
        return p.get(x);
    }
    private void union(Map<String, String> p, String a, String b) {
        a = find(p, a); b = find(p, b);
        if (!a.equals(b)) p.put(a, b);
    }
    public boolean isCorrect(List<List<String>> accounts, List<List<String>> output) {
        List<List<String>> exp = accountsMerge(accounts);
        if (output == null || output.size() != exp.size()) return false;
        // Normalize both: sort emails within, sort accounts
        List<List<String>> a = normalize(exp);
        List<List<String>> b = normalize(output);
        return a.equals(b);
    }
    private List<List<String>> normalize(List<List<String>> list) {
        List<List<String>> res = new ArrayList<>();
        for (List<String> acc : list) {
            List<String> copy = new ArrayList<>(acc);
            String name = copy.get(0);
            List<String> emails = new ArrayList<>(copy.subList(1, copy.size()));
            Collections.sort(emails);
            List<String> row = new ArrayList<>();
            row.add(name);
            row.addAll(emails);
            res.add(row);
        }
        res.sort((x, y) -> {
            int c = x.get(0).compareTo(y.get(0));
            if (c != 0) return c;
            return x.get(1).compareTo(y.get(1));
        });
        return res;
    }
}
