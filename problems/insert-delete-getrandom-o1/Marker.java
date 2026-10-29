import java.util.*;
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        RandomizedSet obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("RandomizedSet")) {
                obj = new RandomizedSet();
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
        Set<Integer> ref = new HashSet<>();
        boolean live = false;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            String got = output.get(i).trim();
            if (op.equals("RandomizedSet")) {
                if (!got.equals("null")) return false;
                live = true;
                ref.clear();
            } else if (op.equals("insert")) {
                if (!live) return false;
                if (values[i] == null || values[i].length < 1) return false;
                String exp = ref.add(values[i][0]) ? "true" : "false";
                if (!got.equals(exp)) return false;
            } else if (op.equals("remove")) {
                if (!live) return false;
                if (values[i] == null || values[i].length < 1) return false;
                String exp = ref.remove(values[i][0]) ? "true" : "false";
                if (!got.equals(exp)) return false;
            } else if (op.equals("getRandom")) {
                if (!live) return false;
                int v;
                try {
                    v = Integer.parseInt(got);
                } catch (NumberFormatException e) {
                    return false;
                }
                if (!ref.contains(v)) return false;
            } else {
                return false;
            }
        }
        return live;
    }

    static class RandomizedSet {
        private final List<Integer> list = new ArrayList<>();
        private final Map<Integer, Integer> idx = new HashMap<>();
        private final Random rand = new Random();
        boolean insert(int val) {
            if (idx.containsKey(val)) return false;
            idx.put(val, list.size());
            list.add(val);
            return true;
        }
        boolean remove(int val) {
            Integer pos = idx.get(val);
            if (pos == null) return false;
            int last = list.get(list.size() - 1);
            list.set(pos, last);
            idx.put(last, pos);
            list.remove(list.size() - 1);
            idx.remove(val);
            return true;
        }
        int getRandom() {
            return list.get(rand.nextInt(list.size()));
        }
    }
}
