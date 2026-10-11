import java.util.*;
class Marker {
    public int[] fairCandySwap(int[] aliceSizes, int[] bobSizes) {
        int sumA = 0, sumB = 0;
        for (int x : aliceSizes) sumA += x;
        for (int x : bobSizes) sumB += x;
        int diff = (sumA - sumB) / 2;
        Set<Integer> bob = new HashSet<>();
        for (int x : bobSizes) bob.add(x);
        for (int a : aliceSizes) {
            if (bob.contains(a - diff)) return new int[]{a, a - diff};
        }
        return new int[0];
    }
    public boolean isCorrect(int[] aliceSizes, int[] bobSizes, int[] output) {
        if (output == null || output.length != 2) return false;
        int sumA = 0, sumB = 0;
        Set<Integer> setA = new HashSet<>(), setB = new HashSet<>();
        for (int x : aliceSizes) {
            sumA += x;
            setA.add(x);
        }
        for (int x : bobSizes) {
            sumB += x;
            setB.add(x);
        }
        if (!setA.contains(output[0]) || !setB.contains(output[1])) return false;
        return sumA - output[0] + output[1] == sumB - output[1] + output[0];
    }
}
