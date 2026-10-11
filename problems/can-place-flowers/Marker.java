class Marker {
    public boolean canPlaceFlowers(int[] flowerbed, int n) {
        int[] a = flowerbed.clone();
        int placed = 0;
        for (int i = 0; i < a.length; i++) {
            if (a[i]==0 && (i==0||a[i-1]==0) && (i==a.length-1||a[i+1]==0)) {
                a[i]=1; placed++;
                if (placed>=n) return true;
            }
        }
        return placed>=n;
    }
    public boolean isCorrect(int[] flowerbed, int n, boolean output) {
        return canPlaceFlowers(flowerbed, n) == output;
    }
}
