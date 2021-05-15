DROP TABLE Person_Animal_Relationship;
DROP TABLE Animal_Animal_Relationship;
DROP TABLE Person_Person_Relationship;

CREATE TYPE rel_index AS (
    relationship_id    	integer,
    from_id       		integer,
    to_id 				integer
);

CREATE TABLE Person_Person_Relationship (
	id rel_index NOT NULL,
	person_from_id INT NOT NULL REFERENCES Person(id),
	person_to_id INT NOT NULL REFERENCES Person(id),
	relationship_id INT NOT NULL REFERENCES Relationship(id),
	PRIMARY KEY(id),
	CONSTRAINT person_from_id_fk FOREIGN KEY(person_from_id) REFERENCES Person(id), 
	CONSTRAINT person_to_id_fk FOREIGN KEY(person_to_id) REFERENCES Person(id),
	CONSTRAINT relationship_id_fk_1 FOREIGN KEY(relationship_id) REFERENCES Relationship(id)
);

CREATE TABLE Person_Animal_Relationship (
	id rel_index NOT NULL,
	person_id INT NOT NULL REFERENCES Person(id),
	animal_id INT NOT NULL REFERENCES Animal(id),
	relationship_id INT NOT NULL REFERENCES Relationship(id),
	PRIMARY KEY(id),
	CONSTRAINT person_id_fk FOREIGN KEY(person_id) REFERENCES Person(id),
	CONSTRAINT animal_id_fk FOREIGN KEY(animal_id) REFERENCES Animal(id),
	CONSTRAINT relationship_id_fk_2 FOREIGN KEY(relationship_id) REFERENCES Relationship(id)
);

CREATE TABLE Animal_Animal_Relationship (
	id rel_index NOT NULL,
	animal_from_id INT NOT NULL REFERENCES Animal(id),
	animal_to_id INT NOT NULL REFERENCES Animal(id),
	relationship_id INT NOT NULL REFERENCES Relationship(id),
	PRIMARY KEY(id),
	CONSTRAINT animal_from_id_fk FOREIGN KEY(animal_from_id) REFERENCES Animal(id), 
	CONSTRAINT animal_to_id_fk FOREIGN KEY(animal_to_id) REFERENCES Animal(id),
	CONSTRAINT relationship_id_fk_3 FOREIGN KEY(relationship_id) REFERENCES Relationship(id)
);