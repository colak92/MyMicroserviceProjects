CREATE TABLE IF NOT EXISTS company (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(255),
    logo VARCHAR(255),
    description TEXT,
    email VARCHAR(255),
    created_at DATETIME,
    founded_date DATE,
    rate DOUBLE,
    CHECK (rate >= 0 AND rate <= 5)
);

CREATE TABLE IF NOT EXISTS founder (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id BIGINT NULL,
    CONSTRAINT FK_founder_company FOREIGN KEY (company_id) REFERENCES company(id)
);