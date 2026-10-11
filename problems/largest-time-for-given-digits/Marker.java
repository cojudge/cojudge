class Marker {
    public String largestTimeFromDigits(int[] arr) {
        String best = "";
        int bestMin = -1;
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 4; j++) {
                if (j == i) continue;
                for (int k = 0; k < 4; k++) {
                    if (k == i || k == j) continue;
                    int l = 6 - i - j - k;
                    int hh = arr[i] * 10 + arr[j];
                    int mm = arr[k] * 10 + arr[l];
                    if (hh < 24 && mm < 60) {
                        int tot = hh * 60 + mm;
                        if (tot > bestMin) {
                            bestMin = tot;
                            best = String.format("%02d:%02d", hh, mm);
                        }
                    }
                }
            }
        }
        return best;
    }
    public boolean isCorrect(int[] arr, String output) {
        return largestTimeFromDigits(arr).equals(output);
    }
}
