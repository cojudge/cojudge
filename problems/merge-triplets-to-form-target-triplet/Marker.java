class Marker {
    public boolean mergeTriplets(int[][] triplets, int[] target) {
        boolean first = false;
        boolean second = false;
        boolean third = false;

        for (int[] triplet : triplets) {
            if (triplet[0] > target[0]
                    || triplet[1] > target[1]
                    || triplet[2] > target[2]) {
                continue;
            }
            first |= triplet[0] == target[0];
            second |= triplet[1] == target[1];
            third |= triplet[2] == target[2];
        }
        return first && second && third;
    }

    public boolean isCorrect(int[][] triplets, int[] target, boolean output) {
        return mergeTriplets(triplets, target) == output;
    }
}
