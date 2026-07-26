import java.util.*;

class Marker {
    public List<List<String>> partition(String s) {
        List<List<String>> result = new ArrayList<>();
        buildPartitions(s, 0, new ArrayList<>(), result);
        return result;
    }

    private void buildPartitions(String s, int start, List<String> current,
                                 List<List<String>> result) {
        if (start == s.length()) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int end = start; end < s.length(); end++) {
            if (!isPalindrome(s, start, end)) continue;
            current.add(s.substring(start, end + 1));
            buildPartitions(s, end + 1, current, result);
            current.remove(current.size() - 1);
        }
    }

    private boolean isPalindrome(String s, int left, int right) {
        while (left < right) {
            if (s.charAt(left++) != s.charAt(right--)) return false;
        }
        return true;
    }

    public boolean isCorrect(String s, List<List<String>> output) {
        List<List<String>> expected = canonicalize(partition(s));
        List<List<String>> actual = canonicalize(output);
        return actual != null && expected.equals(actual);
    }

    private List<List<String>> canonicalize(List<List<String>> partitions) {
        if (partitions == null) return null;
        List<List<String>> result = new ArrayList<>();
        for (List<String> partition : partitions) {
            if (partition == null || partition.contains(null)) return null;
            result.add(new ArrayList<>(partition));
        }
        result.sort(this::compareRows);
        return result;
    }

    private int compareRows(List<String> a, List<String> b) {
        int limit = Math.min(a.size(), b.size());
        for (int i = 0; i < limit; i++) {
            int comparison = a.get(i).compareTo(b.get(i));
            if (comparison != 0) return comparison;
        }
        return Integer.compare(a.size(), b.size());
    }
}
