INSERT INTO founder (name, company_id)
    SELECT * FROM (SELECT 'Steve Jobs', NULL) AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM founder WHERE name = 'Steve Jobs'
        );

INSERT INTO founder (name, company_id)
    SELECT * FROM (SELECT 'Steve Wozniak', NULL) AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM founder WHERE name = 'Steve Wozniak'
        );

INSERT INTO founder (name, company_id)
    SELECT * FROM (SELECT 'Michail Dell', NULL) AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM founder WHERE name = 'Michail Dell'
        );

INSERT INTO founder (name, company_id)
    SELECT * FROM (SELECT 'Bill Hewlett', NULL) AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM founder WHERE name = 'Bill Hewlett'
        );

INSERT INTO founder (name, company_id)
    SELECT * FROM (SELECT 'Ronald Wayne', NULL) AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM founder WHERE name = 'Ronald Wayne'
        );

INSERT INTO founder (name, company_id)
    SELECT * FROM (SELECT 'David Packard', NULL) AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM founder WHERE name = 'David Packard'
        );
