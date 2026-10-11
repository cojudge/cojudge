class Marker {
    public int findMinMoves(int[] machines) {
        int n = machines.length;
        long total = 0;
        for (int x : machines) total += x;
        if (total % n != 0) return -1;
        long avg = total / n;
        long ans = 0;
        long balance = 0;
        for (int x : machines) {
            long diff = (long) x - avg;
            balance += diff;
            ans = Math.max(ans, Math.max(Math.abs(balance), diff));
        }
        return (int) ans;
    }
    public boolean isCorrect(int[] machines, int output) {
        return output == findMinMoves(machines);
    }
}
