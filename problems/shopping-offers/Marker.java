import java.util.*;
class Marker {
    private Map<String, Integer> memo;
    private int[] price;
    private List<int[]> offers;
    public int shoppingOffers(int[] price, int[][] special, int[] needs) {
        this.price = price;
        this.offers = new ArrayList<>();
        for (int[] s : special) {
            int direct = 0;
            for (int i = 0; i < price.length; i++) direct += s[i] * price[i];
            if (direct > s[price.length]) offers.add(s);
        }
        this.memo = new HashMap<>();
        return dfs(needs.clone());
    }
    private int dfs(int[] needs) {
        String key = Arrays.toString(needs);
        Integer hit = memo.get(key);
        if (hit != null) return hit;
        int best = 0;
        for (int i = 0; i < needs.length; i++) best += needs[i] * price[i];
        for (int[] s : offers) {
            boolean ok = true;
            for (int i = 0; i < needs.length; i++) {
                if (s[i] > needs[i]) { ok = false; break; }
            }
            if (!ok) continue;
            int[] nxt = needs.clone();
            for (int i = 0; i < needs.length; i++) nxt[i] -= s[i];
            best = Math.min(best, s[needs.length] + dfs(nxt));
        }
        memo.put(key, best);
        return best;
    }
    public boolean isCorrect(int[] price, int[][] special, int[] needs, int output) {
        return shoppingOffers(price, special, needs) == output;
    }
}
