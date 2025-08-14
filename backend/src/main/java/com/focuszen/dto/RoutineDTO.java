package com.focuszen.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineDTO {
    private Long id;
    private String name;
    private String description;
    private boolean active;
}
