package com.junctionx.Junctionx;

import com.google.cloud.bigquery.BigQuery;
import com.google.cloud.bigquery.BigQueryOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

@Slf4j
@SpringBootApplication
public class JunctionxApplication {

	@Autowired
	private Environment env;

	public static void main(String[] args) {
		SpringApplication.run(JunctionxApplication.class, args);
	}

	@Bean
	public BigQuery getBigQuery() {
		log.info(env.getProperty("GOOGLE_APPLICATION_CREDENTIALS"));
		return BigQueryOptions.getDefaultInstance().getService();
	}

}