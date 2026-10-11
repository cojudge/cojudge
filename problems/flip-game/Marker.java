import java.util.*;
class Marker {
    public List<String> generatePossibleNextMoves(String currentState) {
        List<String> res = new ArrayList<>();
        for (int i = 0; i + 1 < currentState.length(); i++) {
            if (currentState.charAt(i) == '+' && currentState.charAt(i + 1) == '+') {
                res.add(currentState.substring(0, i) + "--" + currentState.substring(i + 2));
            }
        }
        return res;
    }
    public boolean isCorrect(String currentState, List<String> output) {
        if (output == null) return false;
        List<String> ans = generatePossibleNextMoves(currentState);
        return new HashSet<>(ans).equals(new HashSet<>(output)) && ans.size() == output.size();
    }
}
