import { PrismaClient, GameType, NumberOfPlayers } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // create subscription plans
  const freePlan = await prisma.subscriptionPlan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Free',
      price: 0,
    },
  })

  const premiumPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Premium',
      price: 980,
    },
  })

  // テストユーザーの作成
  const user1 = await prisma.user.upsert({
    where: { email: 'test1@example.com' },
    update: {},
    create: {
      email: 'test1@example.com',
      userName: 'Risa Yamamoto',
      language: 'ja',
      subscriptionPlanId: freePlan.id,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'test2@example.com' },
    update: {},
    create: {
      email: 'test2@example.com',
      userName: 'KakimaruTV',
      language: 'ja',
      subscriptionPlanId: freePlan.id,
    },
  })

  // テストゲームの作成
  const game = await prisma.game.create({
    data: {
      gameType: GameType.FREE,
      numberOfPlayers: NumberOfPlayers.THREE,
      playedAt: new Date(),
      rate: 100,
      chipRate: 200,
      fee: 9000,
      createdBy: user1.id,
      chipResults: {
        create: [
          {
            userId: user1.id,
            chipChange: 23,
          },
          {
            userId: user2.id,
            chipChange: -11,
          },
          {
            chipChange: 7,
          },
          {
            chipChange: -19,
          },
        ],
      },
      rounds: {
        create: {
          roundNumber: 1,
          roundResults: {
            create: [
              {
                userId: user1.id,
                scoreChange: 60,
                rank: 1,
              },
              {
                userId: user2.id,
                scoreChange: 22,
                rank: 2,
              },
              {
                userId: null,
                scoreChange: -10,
                rank: 3,
              },
              {
                userId: null,
                scoreChange: -72,
                rank: 4,
              },
            ],
          },
        },
      },
    },
  })

  console.log({ freePlan, premiumPlan, user1, user2, game })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 