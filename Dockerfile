FROM gradle:9.1.0-jdk25 AS build
WORKDIR /app
COPY build.gradle settings.gradle gradlew gradlew.bat ./
COPY gradle gradle
COPY src src
RUN ./gradlew --no-daemon clean bootJar -x test

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/build/libs/spring-web-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
