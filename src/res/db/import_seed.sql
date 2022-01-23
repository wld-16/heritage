INSERT INTO relationship (id, label, opposite_id) VALUES (1, 'child', 2);
INSERT INTO relationship (id, label, opposite_id) VALUES (2, 'parent', 1);
CREATE TABLE ppr_temp (	id SERIAL NOT NULL,	person_from_id INT NOT NULL REFERENCES Person(id),	person_to_id INT NOT NULL REFERENCES Person(id), relationship_id INT NOT NULL REFERENCES Relationship(id),	PRIMARY KEY(id),	CONSTRAINT person_from_id_fk FOREIGN KEY(person_from_id) REFERENCES Person(id), 	CONSTRAINT person_to_id_fk FOREIGN KEY(person_to_id) REFERENCES Person(id),	CONSTRAINT relationship_id_fk_1 FOREIGN KEY(relationship_id) REFERENCES Relationship(id));
\copy person from 'people.csv' DELIMITER ',' csv header;
\copy ppr_temp (id,person_from_id, person_to_id,relationship_id) from 'relationships.csv' DELIMITER ';' csv header;
INSERT INTO person_person_relationship (id, person_from_id, person_to_id, relationship_id) SELECT (person_from_id, person_to_id, relationship_id)::rel_index,person_from_id, person_to_id, relationship_id FROM ppr_temp;
DROP TABLE ppr_temp;