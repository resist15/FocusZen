package com.focuszen.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.focuszen.dto.GoalDTO;
import com.focuszen.entity.Goal;
import com.focuszen.entity.User;
import com.focuszen.repositories.GoalRepository;
import com.focuszen.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

	private final GoalRepository goalRepository;
	private final UserRepository userRepository;

	@Override
	public GoalDTO createGoal(GoalDTO goalDTO, String username) {
		User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));

		Goal goal = Goal.builder().title(goalDTO.getTitle()).description(goalDTO.getDescription())
				.targetValue(goalDTO.getTargetValue()).currentValue(0) // start from zero
				.deadline(goalDTO.getDeadline()).completed(false).user(user).build();

		return mapToDTO(goalRepository.save(goal));
	}

	@Override
	public List<GoalDTO> getUserGoals(String username) {
		User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));

		return goalRepository.findByUser(user).stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	@Override
	public GoalDTO updateProgress(Long goalId, int progress, String username) {
		User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));

		Goal goal = goalRepository.findById(goalId).orElseThrow(() -> new RuntimeException("Goal not found"));

		if (!goal.getUser().getId().equals(user.getId())) {
			throw new RuntimeException("Unauthorized access");
		}

		goal.setCurrentValue(progress);
		if (progress >= goal.getTargetValue()) {
			goal.setCompleted(true);
		}

		return mapToDTO(goalRepository.save(goal));
	}

	@Override
	public void deleteGoal(Long goalId, String username) {
		User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));

		Goal goal = goalRepository.findById(goalId).orElseThrow(() -> new RuntimeException("Goal not found"));

		if (!goal.getUser().getId().equals(user.getId())) {
			throw new RuntimeException("Unauthorized access");
		}

		goalRepository.delete(goal);
	}

	private GoalDTO mapToDTO(Goal goal) {
		return GoalDTO.builder().id(goal.getId()).title(goal.getTitle()).description(goal.getDescription())
				.targetValue(goal.getTargetValue()).currentValue(goal.getCurrentValue()).deadline(goal.getDeadline())
				.completed(goal.isCompleted()).build();
	}
}
