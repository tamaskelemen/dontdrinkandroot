package com.junctionx.Junctionx.com.junctionx.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.junctionx.Junctionx.repository.BigQueryRepository;

@Controller
public class MovementController {

	@Autowired
	BigQueryRepository bigQueryRepository;

	@GetMapping("/movement")
	@ResponseBody
	public String getMovement() {
		bigQueryRepository.getData();
		return "";
	}
}
