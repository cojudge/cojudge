class Marker {
    public boolean carPooling(int[][] trips, int capacity) {
        int[] delta = new int[1001];
        for (int[] trip : trips) {
            int passengers = trip[0];
            delta[trip[1]] += passengers;
            delta[trip[2]] -= passengers;
        }
        int onboard = 0;
        for (int i = 0; i < delta.length; i++) {
            onboard += delta[i];
            if (onboard > capacity) {
                return false;
            }
        }
        return true;
    }

    public boolean isCorrect(int[][] trips, int capacity, boolean output) {
        return carPooling(trips, capacity) == output;
    }
}