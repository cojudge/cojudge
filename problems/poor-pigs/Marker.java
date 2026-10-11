class Marker {
    public int poorPigs(int buckets, int minutesToDie, int minutesToTest) {
        int rounds = minutesToTest / minutesToDie;
        int states = rounds + 1;
        int pigs = 0;
        long coverage = 1;
        while (coverage < buckets) {
            pigs++;
            coverage *= states;
        }
        return pigs;
    }
    public boolean isCorrect(int buckets, int minutesToDie, int minutesToTest, int output) {
        return poorPigs(buckets, minutesToDie, minutesToTest) == output;
    }
}
