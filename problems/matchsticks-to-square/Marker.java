import java.util.*;

class Marker {
    public boolean makesquare(int[] matchsticks) {
        long total = 0;
        for (int m : matchsticks) total += m;
        if (total % 4 != 0) return false;
        long target = total / 4;
        int[] sticks = matchsticks.clone();
        Arrays.sort(sticks);
        reverse(sticks);
        long[] sides = new long[4];
        return canPlace(sticks, 0, sides, target);
    }

    private boolean canPlace(int[] sticks, int index, long[] sides, long target) {
        if (index == sticks.length) {
            return sides[0] == target && sides[1] == target
                    && sides[2] == target && sides[3] == target;
        }
        int stick = sticks[index];
        for (int i = 0; i < 4; i++) {
            if (sides[i] + stick > target) continue;
            if (i > 0 && sides[i] == sides[i - 1]) continue;
            sides[i] += stick;
            if (canPlace(sticks, index + 1, sides, target)) return true;
            sides[i] -= stick;
        }
        return false;
    }

    private void reverse(int[] arr) {
        int i = 0, j = arr.length - 1;
        while (i < j) {
            int tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
            i++;
            j--;
        }
    }

    public boolean isCorrect(int[] matchsticks, boolean output) {
        return makesquare(matchsticks) == output;
    }
}