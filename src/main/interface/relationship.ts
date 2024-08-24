interface RelationshipType {
    id: number,
    label: string,
    oppositeId: number
}

interface Relationship {
    relationship_id: number,
    person_from_id: number,
    person_to_id: number
}