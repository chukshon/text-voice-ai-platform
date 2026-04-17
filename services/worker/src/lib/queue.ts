import amqplib from "amqplib";

const TTS_QUEUE = "tts_jobs";

let connection: Awaited<ReturnType<typeof amqplib.connect>> | null = null;
let channel: Awaited<
  ReturnType<Awaited<ReturnType<typeof amqplib.connect>>["createChannel"]>
> | null = null;

async function getChannel() {
  if (channel) return channel;

  const url = process.env.RABBITMQ_URL;
  if (!url) throw new Error("RABBITMQ_URL environment variable is required");

  connection = await amqplib.connect(url);
  channel = await connection.createChannel();

  // Queue that survives broker restarts
  await channel.assertQueue(TTS_QUEUE, { durable: true });

  // Prefetch one job at a time to avoid overwhelming the system
  await channel.prefetch(1);

  return channel;
}
