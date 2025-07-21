package com.focuszen.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.focuszen.dto.MindfulnessDTO;
import com.focuszen.entity.MindfulnessLog;
import com.focuszen.entity.User;
import com.focuszen.repositories.MindfulnessRepository;
import com.focuszen.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MindfulnessServiceImpl implements MindfulnessService {

    private final MindfulnessRepository mindfulnessRepository;
    private final UserRepository userRepository;

    @Override
    public MindfulnessDTO logActivity(MindfulnessDTO dto, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        MindfulnessLog log = MindfulnessLog.builder()
                .activityType(dto.getActivityType())
                .durationInMinutes(dto.getDurationInMinutes())
                .timestamp(dto.getTimestamp())
                .user(user)
                .build();
        log = mindfulnessRepository.save(log);
        dto.setId(log.getId());
        return dto;
    }

    @Override
    public List<MindfulnessDTO> getUserMindfulnessLogs(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return mindfulnessRepository.findByUser(user).stream().map(log -> MindfulnessDTO.builder()
                .id(log.getId())
                .activityType(log.getActivityType())
                .durationInMinutes(log.getDurationInMinutes())
                .timestamp(log.getTimestamp())
                .build()).collect(Collectors.toList());
    }

    @Override
    public void deleteMindfulnessLog(Long logId, String username) {
        MindfulnessLog log = mindfulnessRepository.findById(logId).orElseThrow();
        if (!log.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        mindfulnessRepository.delete(log);
    }
}
