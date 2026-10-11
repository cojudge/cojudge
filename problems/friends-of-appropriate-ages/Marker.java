class Marker {
    public int numFriendRequests(int[] ages) {
        int[] cnt = new int[121];
        for (int a : ages) cnt[a]++;
        int ans = 0;
        for (int a = 1; a <= 120; a++) {
            if (cnt[a] == 0) continue;
            for (int b = 1; b <= 120; b++) {
                if (cnt[b] == 0) continue;
                if (b <= a / 2 + 7) continue;
                if (b > a) continue;
                if (b > 100 && a < 100) continue;
                ans += cnt[a] * (cnt[b] - (a == b ? 1 : 0));
            }
        }
        return ans;
    }
    public boolean isCorrect(int[] ages, int output) {
        return numFriendRequests(ages) == output;
    }
}
