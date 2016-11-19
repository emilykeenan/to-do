CREATE TABLE tasks (
id SERIAL PRIMARY KEY,
description VARCHAR(200) NOT NULL,
status VARCHAR(20) NOT NULL
);

INSERT INTO tasks (description, status)
VALUES ('Do the dishes', 'incomplete'),
('Be better', 'incomplete');