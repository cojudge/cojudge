import java.util.*;
class Marker {
    public int bagOfTokensScore(int[] tokens, int power) {
        int[] t = tokens.clone();
        Arrays.sort(t);
        int l = 0;
        int r = t.length - 1;
        int score = 0;
        int best = 0;
        while (l <= r) {
            if (power >= t[l]) {
                power -= t[l];
                l++;
                score++;
                if (score > best) {
                    best = score;
                }
            } else if (score > 0) {
                power += t[r];
                r--;
                score--;
            } else {
                break;
            }
        }
        return best;
    }
    public boolean isCorrect(int[] tokens, int power, int output) {
        return bagOfTokensScore(tokens, power) == output;
    }
}
