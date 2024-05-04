import { faker } from "@faker-js/faker";

export const generateUser = () => {
  const randomName = `${faker.word.adjective()} ${faker.animal.type()}`
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return {
    name: randomName,
    avatar: faker.image.avatarGitHub(),
  };
};
