import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
});

type QueryEvent = {
  timestamp: Date;
  query: string;
  params: string;
  duration: number;
  target: string;
};

// ANSI color codes
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};


prisma.$on('query' as never, (e: QueryEvent) => {
  if (e.query.includes("COMMIT")) {
    return;
  }
  console.log(`${colors.blue}[Prisma Log] Query: ${colors.reset}` + e.query);
  console.log(`${colors.green}[Prisma Log] Params: ${colors.reset}` + e.params);
  console.log(`${colors.yellow}[Prisma Log] Duration: ${colors.reset}` + e.duration + 'ms');
  
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
