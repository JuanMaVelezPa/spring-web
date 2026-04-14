package com.jm.spring_web;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.autoconfigure.exclude=" +
				"org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration," +
				"org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration," +
				"org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration",
		"app.notifications.enabled=false"
})
class SpringWebApplicationTests {

	@Test
	void contextLoads() {
	}

}
