class Marker {
    public boolean canReach(String s, int minJump, int maxJump) {
        int n = s.length();
        if (s.charAt(0) == '1') return false;

        boolean[] reachable = new boolean[n];
        reachable[0] = true;
        int window = 0;

        for (int i = 1; i < n; i++) {
            if (i - minJump >= 0 && reachable[i - minJump]) window++;
            if (i - maxJump - 1 >= 0 && reachable[i - maxJump - 1]) window--;

            if (s.charAt(i) == '0' && window > 0) {
                reachable[i] = true;
            }
        }
        return reachable[n - 1];
    }

    public boolean isCorrect(String s, int minJump, int maxJump, boolean output) {
        return canReach(s, minJump, maxJump) == output;
    }
}