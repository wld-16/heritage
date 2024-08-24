enum Sex {
    male,
    female
}

interface Animal{
    id?: number,
    name: string,
    isAlive: boolean,
    sex: Sex,
    species_id: number,
    race_id: number
}