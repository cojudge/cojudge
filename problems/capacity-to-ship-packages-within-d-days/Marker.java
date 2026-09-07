class Marker {
    private boolean canShip(int[] weights, int days, int capacity) {
        int used = 1;
        int load = 0;
        for (int w : weights) {
            if (load + w > capacity) {
                used++;
                load = w;
            } else {
                load += w;
            }
        }
        return used <= days;
    }

    public int shipWithinDays(int[] weights, int days) {
        int low = 0;
        int high = 0;
        for (int w : weights) {
            if (w > low) low = w;
            high += w;
        }
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (canShip(weights, days, mid)) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        return low;
    }

    public boolean isCorrect(int[] weights, int days, int output) {
        return output == shipWithinDays(weights, days);
    }
}
