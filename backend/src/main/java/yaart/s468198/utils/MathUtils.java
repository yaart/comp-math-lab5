package yaart.s468198.utils;

public class MathUtils {

    public static double factorial(int n) {
        if (n < 0) return 0;
        double result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    public static double round(double value, int places) {
        double scale = Math.pow(10, places);
        return Math.round(value * scale) / scale;
    }
}