class Marker {
    public boolean isRectangleOverlap(int[] rec1, int[] rec2) {
        return rec1[0] < rec2[2] && rec2[0] < rec1[2]
            && rec1[1] < rec2[3] && rec2[1] < rec1[3];
    }
    public boolean isCorrect(int[] rec1, int[] rec2, boolean output) {
        return isRectangleOverlap(rec1, rec2) == output;
    }
}
