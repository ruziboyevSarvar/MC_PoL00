package uz.mcpoloo.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@Configuration
public class S3Config {
    @Bean
    S3Client acdnS3Client(
            @Value("${acdn.s3.endpoint}") String endpoint,
            @Value("${acdn.s3.region}") String region,
            @Value("${acdn.s3.access-key}") String accessKey,
            @Value("${acdn.s3.secret-key}") String secretKey,
            @Value("${acdn.s3.path-style-access:true}") boolean pathStyleAccess
    ) {
        AwsCredentialsProvider credentialsProvider = () -> {
            if (!StringUtils.hasText(accessKey) || !StringUtils.hasText(secretKey)) {
                throw new IllegalStateException("ACDN S3 credentials are not configured");
            }
            return AwsBasicCredentials.create(accessKey, secretKey);
        };

        return S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of(region))
                .credentialsProvider(credentialsProvider)
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(pathStyleAccess)
                        .build())
                .build();
    }
}
