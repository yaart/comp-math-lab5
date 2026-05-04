package yaart.s468198.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yaart.s468198.dto.InterpolationRequest;
import yaart.s468198.dto.InterpolationResponse;
import yaart.s468198.service.InterpolationService;

import java.util.List;

@RestController
@RequestMapping("/api/interpolation")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class InterpolationController {

    private final InterpolationService interpolationService;

    @PostMapping("/calculate")
    public ResponseEntity<?> calculate(@RequestBody InterpolationRequest request) {
        if (request.points() == null || request.points().size() < 2) {
            return ResponseEntity.badRequest().body("Недостаточно точек для интерполяции");
        }
        try {
            List<InterpolationResponse> results = interpolationService.calculateAll(
                    request.points(),
                    request.targetX()
            );
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Ошибка: " + e.getMessage());
        }
    }
}