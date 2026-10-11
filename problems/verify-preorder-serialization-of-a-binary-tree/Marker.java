class Marker {
    public boolean isValidSerialization(String preorder) {
        String[] tokens = preorder.split(",", -1);
        int slots = 1;
        for (String t : tokens) {
            slots--;
            if (slots < 0) return false;
            if (!t.equals("#")) slots += 2;
        }
        return slots == 0;
    }
    public boolean isCorrect(String preorder, boolean output) {
        return isValidSerialization(preorder) == output;
    }
}
