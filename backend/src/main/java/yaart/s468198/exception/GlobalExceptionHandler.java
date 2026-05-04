package yaart.s468198.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ArithmeticException.class)
    public ResponseEntity<String> handleArithmetic(ArithmeticException e) {
        return ResponseEntity.badRequest().body("Ошибка в математических расчетах: " + e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleParams(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body("Некорректные входные данные: " + e.getMessage());
    }
}
