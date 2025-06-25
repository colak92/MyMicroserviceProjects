/* NECESSARY SKILL DATA */
INSERT INTO necessary_skill (name)
    SELECT * FROM (SELECT 'Java') AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM necessary_skill WHERE name = 'Java'
        );

INSERT INTO necessary_skill (name)
    SELECT * FROM (SELECT 'Spring Boot') AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM necessary_skill WHERE name = 'Spring Boot'
            );

INSERT INTO necessary_skill (name)
    SELECT * FROM (SELECT 'Docker') AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM necessary_skill WHERE name = 'Docker'
        );

INSERT INTO necessary_skill (name)
    SELECT * FROM (SELECT 'Kubernetes') AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM necessary_skill WHERE name = 'Kubernetes'
        );

INSERT INTO necessary_skill (name)
    SELECT * FROM (SELECT 'React') AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM necessary_skill WHERE name = 'React'
        );

INSERT INTO necessary_skill (name)
    SELECT * FROM (SELECT 'Swift') AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM necessary_skill WHERE name = 'Swift'
        );

/* ADDITIONAL SKILL DATA */
INSERT INTO additional_skill (name)
    SELECT * FROM (SELECT 'Linux') AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM additional_skill WHERE name = 'Linux'
        );

INSERT INTO additional_skill (name)
    SELECT * FROM (SELECT 'SQL') AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM additional_skill WHERE name = 'SQL'
        );

INSERT INTO additional_skill (name)
    SELECT * FROM (SELECT 'Mui') AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM additional_skill WHERE name = 'Mui'
        );

INSERT INTO additional_skill (name)
    SELECT * FROM (SELECT 'Git') AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM additional_skill WHERE name = 'Git'
        );

INSERT INTO additional_skill (name)
    SELECT * FROM (SELECT 'UX/UI Design') AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM additional_skill WHERE name = 'UX/UI Design'
        );