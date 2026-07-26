import java.util.*;

class Marker {
    private static final String[] LETTERS = {
        "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"
    };

    public List<String> letterCombinations(String digits) {
        List<String> result = new ArrayList<>();
        if (digits.isEmpty()) return result;
        buildCombinations(digits, 0, new StringBuilder(), result);
        return result;
    }

    private void buildCombinations(String digits, int index, StringBuilder current,
                                   List<String> result) {
        if (index == digits.length()) {
            result.add(current.toString());
            return;
        }
        String letters = LETTERS[digits.charAt(index) - '0'];
        for (int i = 0; i < letters.length(); i++) {
            current.append(letters.charAt(i));
            buildCombinations(digits, index + 1, current, result);
            current.deleteCharAt(current.length() - 1);
        }
    }

    public boolean isCorrect(String digits, List<String> output) {
        List<String> expected = canonicalize(letterCombinations(digits));
        List<String> actual = canonicalize(output);
        return actual != null && expected.equals(actual);
    }

    private List<String> canonicalize(List<String> values) {
        if (values == null || values.contains(null)) return null;
        List<String> result = new ArrayList<>(values);
        Collections.sort(result);
        return result;
    }
}
