import { PrismaClient, GameType, NumberOfPlayers } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // create subscription plans
  const freePlan = await prisma.subscriptionPlan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Free",
      price: 0,
    },
  });

  await prisma.subscriptionPlan.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Premium",
      price: 980,
    },
  });

  // テストユーザーの作成
  const user1 = await prisma.user.upsert({
    where: { email: "test1@example.com" },
    update: {
      image: "https://xsgames.co/randomusers/assets/avatars/female/1.jpg",
      backgroundImage:
        "https://images.unsplash.com/photo-1615715874994-bb83092ef331?q=80&w=1200&auto=format&fit=crop",
    },
    create: {
      email: "test1@example.com",
      userName: "Risa Yamamoto",
      language: "ja",
      subscriptionPlanId: freePlan.id,
      image: "https://xsgames.co/randomusers/assets/avatars/female/1.jpg",
      backgroundImage:
        "https://images.unsplash.com/photo-1615715874994-bb83092ef331?q=80&w=1200&auto=format&fit=crop",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "test2@example.com" },
    update: {
      image: "https://xsgames.co/randomusers/assets/avatars/male/2.jpg",
      backgroundImage:
        "https://images.unsplash.com/photo-1529420705456-5c7e04dd043d?q=80&w=1200&auto=format&fit=crop",
    },
    create: {
      email: "test2@example.com",
      userName: "KakimaruTV",
      language: "ja",
      subscriptionPlanId: freePlan.id,
      image: "https://xsgames.co/randomusers/assets/avatars/male/2.jpg",
      backgroundImage:
        "https://images.unsplash.com/photo-1529420705456-5c7e04dd043d?q=80&w=1200&auto=format&fit=crop",
    },
  });

  // テストゲームの作成
  await prisma.game.create({
    data: {
      gameType: GameType.SET,
      numberOfPlayers: NumberOfPlayers.FOUR,
      playedAt: new Date("2024-12-07"),
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
        create: [
          {
            roundNumber: 1,
            roundResults: {
              create: [
                {
                  user: {
                    connect: { id: user1.id },
                  },
                  scoreChange: 12,
                  rank: 2,
                  position: 1,
                },
                {
                  user: {
                    connect: { id: user2.id },
                  },
                  scoreChange: -40,
                  rank: 4,
                  position: 2,
                },
                {
                  scoreChange: -16,
                  rank: 3,
                  position: 3,
                },
                {
                  scoreChange: 44,
                  rank: 1,
                  position: 4,
                },
              ],
            },
          },
          {
            roundNumber: 2,
            roundResults: {
              create: [
                {
                  user: {
                    connect: { id: user1.id },
                  },
                  scoreChange: -18,
                  rank: 3,
                  position: 1,
                },
                {
                  user: {
                    connect: { id: user2.id },
                  },
                  scoreChange: 17,
                  rank: 2,
                  position: 2,
                },
                {
                  scoreChange: -64,
                  rank: 4,
                  position: 3,
                },
                {
                  scoreChange: 65,
                  rank: 1,
                  position: 4,
                },
              ],
            },
          },
          {
            roundNumber: 3,
            roundResults: {
              create: [
                {
                  user: {
                    connect: { id: user1.id },
                  },
                  scoreChange: 58,
                  rank: 1,
                  position: 1,
                },
                {
                  user: {
                    connect: { id: user2.id },
                  },
                  scoreChange: -60,
                  rank: 4,
                  position: 2,
                },
                {
                  scoreChange: 27,
                  rank: 2,
                  position: 3,
                },
                {
                  scoreChange: -25,
                  rank: 3,
                  position: 4,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Game 2
  await prisma.game.create({
    data: {
      gameType: GameType.SET,
      numberOfPlayers: NumberOfPlayers.FOUR,
      playedAt: new Date("2024-12-11"),
      rate: 150,
      chipRate: 150,
      fee: 10000,
      createdBy: user1.id,
      chipResults: {
        create: [
          {
            userId: user1.id,
            chipChange: 20,
          },
          {
            userId: user2.id,
            chipChange: -22,
          },
          {
            chipChange: 2,
          },
          {
            chipChange: 0,
          },
        ],
      },
      rounds: {
        create: [
          {
            roundNumber: 1,
            roundResults: {
              create: [
                {
                  user: {
                    connect: { id: user1.id },
                  },
                  scoreChange: 50,
                  rank: 1,
                  position: 1,
                },
                {
                  user: {
                    connect: { id: user2.id },
                  },
                  scoreChange: -20,
                  rank: 3,
                  position: 2,
                },
                {
                  scoreChange: 8,
                  rank: 2,
                  position: 3,
                },
                {
                  scoreChange: -38,
                  rank: 4,
                  position: 4,
                },
              ],
            },
          },
          {
            roundNumber: 2,
            roundResults: {
              create: [
                {
                  user: {
                    connect: { id: user1.id },
                  },
                  scoreChange: -24,
                  rank: 3,
                  position: 1,
                },
                {
                  user: {
                    connect: { id: user2.id },
                  },
                  scoreChange: 9,
                  rank: 2,
                  position: 2,
                },
                {
                  scoreChange: 57,
                  rank: 1,
                  position: 3,
                },
                {
                  scoreChange: -42,
                  rank: 4,
                  position: 4,
                },
              ],
            },
          },
          {
            roundNumber: 3,
            roundResults: {
              create: [
                {
                  user: {
                    connect: { id: user1.id },
                  },
                  scoreChange: 69,
                  rank: 1,
                  position: 1,
                },
                {
                  user: {
                    connect: { id: user2.id },
                  },
                  scoreChange: 1,
                  rank: 2,
                  position: 2,
                },
                {
                  scoreChange: -47,
                  rank: 4,
                  position: 3,
                },
                {
                  scoreChange: -23,
                  rank: 3,
                  position: 4,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Game 3 (3人プレイ)
  await prisma.game.create({
    data: {
      gameType: GameType.SET,
      numberOfPlayers: NumberOfPlayers.THREE,
      playedAt: new Date("2024-12-15"),
      rate: 100,
      chipRate: 200,
      fee: 8000,
      createdBy: user1.id,
      chipResults: {
        create: [
          {
            userId: user1.id,
            chipChange: 15,
          },
          {
            userId: user2.id,
            chipChange: -8,
          },
          {
            chipChange: -7,
          },
        ],
      },
      rounds: {
        create: [
          {
            roundNumber: 1,
            roundResults: {
              create: [
                {
                  user: { connect: { id: user1.id } },
                  scoreChange: 35,
                  rank: 1,
                  position: 1,
                },
                {
                  user: { connect: { id: user2.id } },
                  scoreChange: -15,
                  rank: 2,
                  position: 2,
                },
                {
                  scoreChange: -20,
                  rank: 3,
                  position: 3,
                },
              ],
            },
          },
          {
            roundNumber: 2,
            roundResults: {
              create: [
                {
                  user: { connect: { id: user1.id } },
                  scoreChange: -25,
                  rank: 3,
                  position: 1,
                },
                {
                  user: { connect: { id: user2.id } },
                  scoreChange: 30,
                  rank: 1,
                  position: 2,
                },
                {
                  scoreChange: -5,
                  rank: 2,
                  position: 3,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Game 4 (2025年1月のデータ)
  await prisma.game.create({
    data: {
      gameType: GameType.SET,
      numberOfPlayers: NumberOfPlayers.FOUR,
      playedAt: new Date("2025-01-05"),
      rate: 100,
      chipRate: 200,
      fee: 9000,
      createdBy: user1.id,
      chipResults: {
        create: [
          {
            userId: user1.id,
            chipChange: -12,
          },
          {
            userId: user2.id,
            chipChange: 25,
          },
          {
            chipChange: -8,
          },
          {
            chipChange: -5,
          },
        ],
      },
      rounds: {
        create: [
          {
            roundNumber: 1,
            roundResults: {
              create: [
                {
                  user: { connect: { id: user1.id } },
                  scoreChange: -30,
                  rank: 4,
                  position: 1,
                },
                {
                  user: { connect: { id: user2.id } },
                  scoreChange: 45,
                  rank: 1,
                  position: 2,
                },
                {
                  scoreChange: -5,
                  rank: 2,
                  position: 3,
                },
                {
                  scoreChange: -10,
                  rank: 3,
                  position: 4,
                },
              ],
            },
          },
          {
            roundNumber: 2,
            roundResults: {
              create: [
                {
                  user: { connect: { id: user1.id } },
                  scoreChange: 20,
                  rank: 2,
                  position: 1,
                },
                {
                  user: { connect: { id: user2.id } },
                  scoreChange: 40,
                  rank: 1,
                  position: 2,
                },
                {
                  scoreChange: -35,
                  rank: 4,
                  position: 3,
                },
                {
                  scoreChange: -25,
                  rank: 3,
                  position: 4,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Game 5 (2025年1月の3人プレイ)
  await prisma.game.create({
    data: {
      gameType: GameType.SET,
      numberOfPlayers: NumberOfPlayers.THREE,
      playedAt: new Date("2025-01-10"),
      rate: 150,
      chipRate: 150,
      fee: 7500,
      createdBy: user1.id,
      chipResults: {
        create: [
          {
            userId: user1.id,
            chipChange: 18,
          },
          {
            userId: user2.id,
            chipChange: -10,
          },
          {
            chipChange: -8,
          },
        ],
      },
      rounds: {
        create: [
          {
            roundNumber: 1,
            roundResults: {
              create: [
                {
                  user: { connect: { id: user1.id } },
                  scoreChange: 25,
                  rank: 1,
                  position: 1,
                },
                {
                  user: { connect: { id: user2.id } },
                  scoreChange: -15,
                  rank: 3,
                  position: 2,
                },
                {
                  scoreChange: -10,
                  rank: 2,
                  position: 3,
                },
              ],
            },
          },
          {
            roundNumber: 2,
            roundResults: {
              create: [
                {
                  user: { connect: { id: user1.id } },
                  scoreChange: 30,
                  rank: 1,
                  position: 1,
                },
                {
                  user: { connect: { id: user2.id } },
                  scoreChange: -20,
                  rank: 3,
                  position: 2,
                },
                {
                  scoreChange: -10,
                  rank: 2,
                  position: 3,
                },
              ],
            },
          },
        ],
      },
    },
  });

  //console.log({ freePlan, premiumPlan, user1, user2, game1 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
