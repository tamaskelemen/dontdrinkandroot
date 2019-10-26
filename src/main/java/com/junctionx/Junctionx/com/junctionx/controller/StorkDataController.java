package com.junctionx.Junctionx.com.junctionx.controller;

import com.junctionx.Junctionx.repository.BigQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@CrossOrigin
@Controller
public class StorkDataController {

	@Autowired
	BigQueryRepository bigQueryRepository;

	@GetMapping("/stork-data")
	@ResponseBody
	public List<List<Double>> getMovement() {
		return bigQueryRepository.getMonthlyCoord();
	}

}
