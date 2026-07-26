import java.util.*;

class Marker {
    private static class Entry {
        final int timestamp;
        final String value;

        Entry(int timestamp, String value) {
            this.timestamp = timestamp;
            this.value = value;
        }
    }

    public List<String> runTimeMap(String[] operations, String[] keys, String[] values, int[] timestamps) {
        Map<String, List<Entry>> history = new HashMap<>();
        List<String> result = new ArrayList<>();

        for (int i = 0; i < operations.length; i++) {
            if (operations[i].equals("set")) {
                history.computeIfAbsent(keys[i], key -> new ArrayList<>())
                        .add(new Entry(timestamps[i], values[i]));
            } else {
                result.add(get(history.get(keys[i]), timestamps[i]));
            }
        }
        return result;
    }

    private String get(List<Entry> entries, int timestamp) {
        if (entries == null) return "";

        int left = 0;
        int right = entries.size() - 1;
        int best = -1;
        while (left <= right) {
            int middle = left + (right - left) / 2;
            if (entries.get(middle).timestamp <= timestamp) {
                best = middle;
                left = middle + 1;
            } else {
                right = middle - 1;
            }
        }
        return best < 0 ? "" : entries.get(best).value;
    }

    public boolean isCorrect(String[] operations, String[] keys, String[] values, int[] timestamps,
                             List<String> output) {
        return runTimeMap(operations, keys, values, timestamps).equals(output);
    }
}
