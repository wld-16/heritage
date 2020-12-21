CREATE TYPE gender AS ENUM ('male', 'female', 'divergent');
CREATE TYPE sex AS ENUM ('male', 'female');

CREATE TABLE Person (
	id SERIAL NOT NULL,
	forname VARCHAR(60),
	surname VARCHAR(60),
	birthdate DATE,
	isAlive BOOL,
	gender gender,
	PRIMARY KEY(id)
);

CREATE TABLE Species (
	id SERIAL NOT NULL,
	label VARCHAR(60),
	PRIMARY KEY(id)
);

CREATE TABLE Race (
	id SERIAL NOT NULL,
	label VARCHAR(60),
	PRIMARY KEY(id)
);

CREATE TABLE Relationship (
	id SERIAL NOT NULL,
	label VARCHAR(60),
	opposite_id INT,
	PRIMARY KEY(id)
);

CREATE TABLE Animal (
	id SERIAL NOT NULL,
	name VARCHAR(60),
	isAlive BOOL,
	sex sex,
	species_id INT NOT NULL REFERENCES Species,
	race_id INT NOT NULL REFERENCES Race,
	PRIMARY KEY(id),
	CONSTRAINT species_id_fk FOREIGN KEY(species_id) REFERENCES Species(id),
	CONSTRAINT race_id_fk FOREIGN KEY(race_id) REFERENCES Race(id)
);

CREATE TABLE Person_Person_Relationship (
	id SERIAL NOT NULL,
	person_from_id INT NOT NULL REFERENCES Person(id),
	person_to_id INT NOT NULL REFERENCES Person(id),
	relationship_id INT NOT NULL REFERENCES Relationship(id),
	PRIMARY KEY(id),
	CONSTRAINT person_from_id_fk FOREIGN KEY(person_from_id) REFERENCES Person(id), 
	CONSTRAINT person_to_id_fk FOREIGN KEY(person_to_id) REFERENCES Person(id),
	CONSTRAINT relationship_id_fk_1 FOREIGN KEY(relationship_id) REFERENCES Relationship(id)
);

CREATE TABLE Person_Animal_Relationship (
	id SERIAL NOT NULL,
	person_id INT NOT NULL REFERENCES Person(id),
	animal_id INT NOT NULL REFERENCES Animal(id),
	relationship_id INT NOT NULL REFERENCES Relationship(id),
	PRIMARY KEY(id),
	CONSTRAINT person_id_fk FOREIGN KEY(person_id) REFERENCES Person(id),
	CONSTRAINT animal_id_fk FOREIGN KEY(animal_id) REFERENCES Animal(id),
	CONSTRAINT relationship_id_fk_2 FOREIGN KEY(relationship_id) REFERENCES Relationship(id)
);

CREATE TABLE Animal_Animal_Relationship (
	id SERIAL NOT NULL,
	animal_from_id INT NOT NULL REFERENCES Animal(id),
	animal_to_id INT NOT NULL REFERENCES Animal(id),
	relationship_id INT NOT NULL REFERENCES Relationship(id),
	PRIMARY KEY(id),
	CONSTRAINT animal_from_id_fk FOREIGN KEY(animal_from_id) REFERENCES Animal(id), 
	CONSTRAINT animal_to_id_fk FOREIGN KEY(animal_to_id) REFERENCES Animal(id),
	CONSTRAINT relationship_id_fk_3 FOREIGN KEY(relationship_id) REFERENCES Relationship(id)
);
