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
    update: {
        image: 'https://xsgames.co/randomusers/assets/avatars/female/1.jpg',
        backgroundImage: 'https://images.unsplash.com/photo-1615715874994-bb83092ef331?q=80&w=1200&auto=format&fit=crop',
    },
    create: {
      email: 'test1@example.com',
      userName: 'Risa Yamamoto',
      language: 'ja',
      subscriptionPlanId: freePlan.id,
      image: 'https://xsgames.co/randomusers/assets/avatars/female/1.jpg',
      backgroundImage: 'https://images.unsplash.com/photo-1615715874994-bb83092ef331?q=80&w=1200&auto=format&fit=crop',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'test2@example.com' },
    update: {
        image: 'https://xsgames.co/randomusers/assets/avatars/male/2.jpg',
        backgroundImage: 'https://images.unsplash.com/photo-1529420705456-5c7e04dd043d?q=80&w=1200&auto=format&fit=crop',
    },
    create: {
      email: 'test2@example.com',
      userName: 'KakimaruTV',
      language: 'ja',
      subscriptionPlanId: freePlan.id,
      image: 'https://xsgames.co/randomusers/assets/avatars/male/2.jpg',
      backgroundImage: 'https://images.unsplash.com/photo-1529420705456-5c7e04dd043d?q=80&w=1200&auto=format&fit=crop',
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
                user: {
                  connect: { id: user1.id },
                },
                scoreChange: 60,
                rank: 1,
                position: 1,
              },
              {
                user: {
                  connect: { id: user2.id },
                },
                scoreChange: 22,
                rank: 2,
                position: 2,
              },
              {
                scoreChange: -10,
                rank: 3,
                position: 3,
              },
              {
                scoreChange: -72,
                rank: 4,
                position: 4,
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