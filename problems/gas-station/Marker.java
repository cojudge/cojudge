class Marker {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        if (gas.length == 0) return -1;

        long total = 0;
        long tank = 0;
        int start = 0;
        for (int i = 0; i < gas.length; i++) {
            long difference = (long) gas[i] - cost[i];
            total += difference;
            tank += difference;
            if (tank < 0) {
                start = i + 1;
                tank = 0;
            }
        }
        return total < 0 ? -1 : start % gas.length;
    }

    public boolean isCorrect(int[] gas, int[] cost, int output) {
        int expected = canCompleteCircuit(gas, cost);
        if (output == -1) return expected == -1;
        if (output < 0 || output >= gas.length || expected == -1) return false;

        long tank = 0;
        for (int step = 0; step < gas.length; step++) {
            int station = (output + step) % gas.length;
            tank += (long) gas[station] - cost[station];
            if (tank < 0) return false;
        }
        return true;
    }
}
