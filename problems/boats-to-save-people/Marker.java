import java.util.*;
class Marker {
    public int numRescueBoats(int[] people, int limit) {
        if (people == null || people.length == 0) return 0;
        int[] a = people.clone();
        Arrays.sort(a);
        int i = 0, j = a.length - 1, boats = 0;
        while (i <= j) {
            if (a[i] + a[j] <= limit) i++;
            j--;
            boats++;
        }
        return boats;
    }
    public boolean isCorrect(int[] people, int limit, int output) {
        return output == numRescueBoats(people, limit);
    }
}
