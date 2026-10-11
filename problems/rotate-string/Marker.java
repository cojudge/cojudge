class Marker {
    public boolean rotateString(String s, String goal) {
        if (s.length() != goal.length()) return false;
        return (s + s).contains(goal);
    }
    public boolean isCorrect(String s, String goal, boolean output) {
        return rotateString(s, goal) == output;
    }
}
