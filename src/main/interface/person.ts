
enum gender {
    male,
    female,
    divergent
}

interface Person {
    id?: number,
    forname: string,
    surname: string,
    birthdate: Date,
    isAlive: boolean
    gender: gender
}