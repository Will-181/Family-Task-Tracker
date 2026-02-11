import { PrismaClient, TaskStatus } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  const requestorsPath = path.join(process.cwd(), "data", "requestors.json");
  const requestorsData = JSON.parse(fs.readFileSync(requestorsPath, "utf-8")) as string[];
  const requestors = Array.isArray(requestorsData) ? requestorsData : ["Chris", "Will"];

  const now = new Date();
  const in1Day = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  await prisma.task.deleteMany({});

  const t1 = await prisma.task.create({
    data: {
      summary: "Fix leaky faucet in bathroom",
      description: "The cold water tap in the main bathroom drips. Need to replace washer or cartridge.",
      notes: "Shutoff under sink.",
      requester: requestors[0] ?? "Chris",
      estimatedMinutes: 45,
      status: TaskStatus.NEW,
      materials: {
        create: [
          { description: "Faucet washer set", quantity: 1, unitPrice: 8.99, vendor: "Hardware store", haveIt: false },
          { description: "Plumber's tape", quantity: 1, unit: "roll", unitPrice: 3.99, haveIt: true },
        ],
      },
      tools: { create: [{ name: "Wrench" }, { name: "Screwdriver" }] },
    },
  });

  const t2 = await prisma.task.create({
    data: {
      summary: "Paint living room accent wall",
      description: "Paint the north wall in the living room (accent color).",
      requester: requestors[1] ?? "Will",
      estimatedMinutes: 180,
      status: TaskStatus.IN_PROGRESS,
      started: true,
      startedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      materials: {
        create: [
          { description: "Paint (accent)", quantity: 2, unit: "gal", unitPrice: 42, vendor: "Home Depot", haveIt: false },
          { description: "Paint roller", quantity: 1, haveIt: true },
        ],
      },
      tools: { create: [{ name: "Brush" }, { name: "Roller" }, { name: "Tray" }] },
    },
  });

  const t3 = await prisma.task.create({
    data: {
      summary: "Replace air filter",
      description: "Replace HVAC air filter in hallway.",
      requester: requestors[0] ?? "Chris",
      estimatedMinutes: 15,
      status: TaskStatus.COMPLETED,
      started: true,
      startedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      completed: true,
      completedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      materials: { create: [{ description: "Air filter 20x25x1", quantity: 1, unitPrice: 18, haveIt: false }] },
      tools: { create: [] },
    },
  });

  const t4 = await prisma.task.create({
    data: {
      summary: "Hang floating shelves in office",
      description: "Install two floating shelves above the desk.",
      requester: requestors[1] ?? "Will",
      estimatedMinutes: 90,
      status: TaskStatus.NEW,
      scheduledStart: in1Day,
      scheduledEnd: new Date(in1Day.getTime() + 90 * 60 * 1000),
      materials: {
        create: [
          { description: "Floating shelf kit", quantity: 2, unitPrice: 35, vendor: "IKEA", link: "https://ikea.com", haveIt: false },
        ],
      },
      tools: { create: [{ name: "Drill" }, { name: "Level" }] },
    },
  });

  const t5 = await prisma.task.create({
    data: {
      summary: "Weed garden beds",
      description: "Weed the front and side garden beds.",
      requester: requestors[0] ?? "Chris",
      estimatedMinutes: 60,
      status: TaskStatus.NEW,
      scheduledStart: in2Days,
      scheduledEnd: new Date(in2Days.getTime() + 60 * 60 * 1000),
      materials: { create: [] },
      tools: { create: [{ name: "Trowel" }, { name: "Gloves" }] },
    },
  });

  const t6 = await prisma.task.create({
    data: {
      summary: "Organize garage storage",
      description: "Sort and label bins in the garage.",
      notes: "Donate unused items.",
      requester: requestors[1] ?? "Will",
      estimatedMinutes: 120,
      status: TaskStatus.NEW,
      materials: { create: [{ description: "Storage bins", quantity: 5, unitPrice: 12, haveIt: false }] },
      tools: { create: [] },
    },
  });

  console.log("Seeded tasks:", [t1.id, t2.id, t3.id, t4.id, t5.id, t6.id].join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
