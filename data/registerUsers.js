import { fakerPT_BR as faker } from '@faker-js/faker';

export const generateRegisterUsers = () => ({
    nome: faker.person.firstName(),
    email: faker.internet.email().toLocaleLowerCase(),
    password: faker.internet.password({ length: 10}),
})

