import java.util.*;
class Marker {
    public boolean isLeapYear(int year) {
        if (year % 400 == 0) return true;
        if (year % 100 == 0) return false;
        return year % 4 == 0;
    }
    public boolean isCorrect(int year, boolean output) {
        return isLeapYear(year) == output;
    }
}
