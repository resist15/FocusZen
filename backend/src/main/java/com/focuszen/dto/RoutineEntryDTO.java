package com.focuszen.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineEntryDTO {
    private Long id;
    private Long routineId;
    private String date; // yyyy-MM-dd format
}
