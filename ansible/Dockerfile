FROM openjdk:17-jdk-slim
WORKDIR /app

# Copie ton code Java/Maven
COPY pom.xml .
COPY src ./src

# Compile l’appli (skip tests pour accélérer)
RUN apt-get update && \
    apt-get install -y maven && \
    mvn clean package -DskipTests && \
    rm -rf /root/.m2

# Expose
EXPOSE 8080

ENTRYPOINT ["java","-jar","target/gestion_absences-0.0.1-SNAPSHOT.jar"]
