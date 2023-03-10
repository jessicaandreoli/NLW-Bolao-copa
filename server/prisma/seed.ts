import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatarUrl: 'https://github.com/jessicaandreoli.png',
    }
  })
  
  const pool = await prisma.pool.create({
    data: {
      title: "Example Pool",
      code: 'BOL123',
      ownerId: user.id,

      //aqui ele cria o participants, assim como criaria abaixo
      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  //const participant = await.prisma.participant.create({
    //data: {
      //user: user.id,
      //pool: pool.id,
    //}
  //})

  await prisma.game.create({
    data: {
      date: '2022-12-15T12:00:00.540Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-12-16T12:00:00.540Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamsPoint: 2,
          secontTeamsPoint: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              }
            }
          }
        }
      }
    }
  })
}

main()