class Marker {
    public int[] constructRectangle(int area) {
        int w = (int) Math.sqrt(area);
        while (area % w != 0) w--;
        return new int[]{area / w, w};
    }
    public boolean isCorrect(int area, int[] output) {
        if (output == null || output.length != 2) return false;
        int[] exp = constructRectangle(area);
        return exp[0] == output[0] && exp[1] == output[1];
    }
}
