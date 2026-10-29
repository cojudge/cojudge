import java.util.*;
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        RandomizedCollection obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("RandomizedCollection")) {
                obj = new RandomizedCollection();
                result.add("null");
            } else if (op.equals("insert")) {
                result.add(String.valueOf(obj.insert(values[i][0])));
            } else if (op.equals("remove")) {
                result.add(String.valueOf(obj.remove(values[i][0])));
            } else if (op.equals("getRandom")) {
                result.add(String.valueOf(obj.getRandom()));
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        if (operations == null || values == null || output == null) return false;
        if (values.length != operations.length || output.size() != operations.length) return false;
        Map<Integer, Integer> counts = new HashMap<>();
        boolean live = false;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            String got = output.get(i).trim();
            if (op.equals("RandomizedCollection")) {
                if (!got.equals("null")) return false;
                live = true;
                counts.clear();
            } else if (op.equals("insert")) {
                if (!live) return false;
                if (values[i] == null || values[i].length < 1) return false;
                int v = values[i][0];
                String exp = counts.getOrDefault(v, 0) == 0 ? "true" : "false";
                if (!got.equals(exp)) return false;
                counts.put(v, counts.getOrDefault(v, 0) + 1);
            } else if (op.equals("remove")) {
                if (!live) return false;
                if (values[i] == null || values[i].length < 1) return false;
                int v = values[i][0];
                int c = counts.getOrDefault(v, 0);
                String exp = c > 0 ? "true" : "false";
                if (!got.equals(exp)) return false;
                if (c == 1) counts.remove(v);
                else if (c > 1) counts.put(v, c - 1);
            } else if (op.equals("getRandom")) {
                if (!live) return false;
                int v;
                try {
                    v = Integer.parseInt(got);
                } catch (NumberFormatException e) {
                    return false;
                }
                if (counts.getOrDefault(v, 0) <= 0) return false;
            } else {
                return false;
            }
        }
        return live;
    }

    static class RandomizedCollection {
        private final List<Integer> list = new ArrayList<>();
        private final Map<Integer, LinkedHashSet<Integer>> idx = new HashMap<>();
        private final Random rand = new Random();
        boolean insert(int val) {
            boolean fresh = !idx.containsKey(val);
            if (fresh) idx.put(val, new LinkedHashSet<>());
            idx.get(val).add(list.size());
            list.add(val);
            return fresh;
        }
        boolean remove(int val) {
            LinkedHashSet<Integer> s = idx.get(val);
            if (s == null || s.isEmpty()) return false;
            int pos = s.iterator().next();
            s.remove(pos);
            int lastPos = list.size() - 1;
            int lastVal = list.get(lastPos);
            if (pos != lastPos) {
                list.set(pos, lastVal);
                LinkedHashSet<Integer> ls = idx.get(lastVal);
                ls.remove(lastPos);
                ls.add(pos);
            }
            list.remove(lastPos);
            if (s.isEmpty()) idx.remove(val);
            return true;
        }
        int getRandom() {
            return list.get(rand.nextInt(list.size()));
        }
    }
}
