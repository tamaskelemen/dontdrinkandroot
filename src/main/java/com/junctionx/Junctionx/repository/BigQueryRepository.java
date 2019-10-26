package com.junctionx.Junctionx.repository;

import com.google.cloud.bigquery.BigQuery;
import com.google.cloud.bigquery.FieldValueList;
import com.google.cloud.bigquery.Job;
import com.google.cloud.bigquery.JobId;
import com.google.cloud.bigquery.JobInfo;
import com.google.cloud.bigquery.QueryJobConfiguration;
import com.google.cloud.bigquery.TableResult;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Repository
@NoArgsConstructor
@Slf4j
public class BigQueryRepository {

	@Autowired
	BigQuery bigQuery;

	public String query = "SELECT * FROM iotds.temp_sensor LIMIT 1000;";

	public List<List<Double>> getCoordinates() {
		try {
			QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(query)
					.setUseLegacySql(false).build();

			JobId jobId = JobId.of(UUID.randomUUID().toString());
			Job queryJob = bigQuery.create(JobInfo.newBuilder(queryConfig).setJobId(jobId).build());

			queryJob = queryJob.waitFor();

			// Check for errors
			if (queryJob == null) {
				throw new RuntimeException("Job no longer exists");
			} else if (queryJob.getStatus().getError() != null) {
				// You can also look at queryJob.getStatus().getExecutionErrors() for all
				// errors, not just the latest one.
				throw new RuntimeException(queryJob.getStatus().getError().toString());
			}

			// Get the results.
			TableResult tableResult = queryJob.getQueryResults();

			List<List<Double>> result = new ArrayList<>();
			// Print all pages of the results.
			for (FieldValueList row : tableResult.iterateAll()) {
				Double lat = row.get("lat").getDoubleValue();
				Double lng = row.get("lat").getDoubleValue();
				List<Double> temp = Arrays.asList(lat,lng);
				result.add(temp);
			}
			return result;
		} catch (Exception e) {
			log.error("----------------Error:", e);
			return null;
		}
	}
}
