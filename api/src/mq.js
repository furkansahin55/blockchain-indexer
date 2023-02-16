const amqplib = require("amqplib");
const { MQ_URL } = require("./config");

class Mq {
  static async getInstance() {
    if (!Mq.instance) {
      Mq.instance = new Mq();
      await Mq.instance.connect();
    }
    return Mq.instance;
  }

  async connect() {
    this.tasksQueue = "tasks";
    this.failedTasksQueue = "failed_tasks";
    const connection = await amqplib.connect(MQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(this.failedTasksQueue, {
      durable: true,
      maxPriority: 10,
    });

    await channel.assertQueue(this.tasksQueue, {
      durable: true,
      maxPriority: 10,
      deadLetterRoutingKey: this.failedTasksQueue,
      deadLetterExchange: "",
    });

    this.channel = channel;
    this.connection = connection;

    // set prefetch
    await channel.prefetch(1);
  }

  async sendTask(id, args, priority = 0) {
    const msg = {
      id,
      args: { created: new Date().getTime(), ...args },
    };
    await this.channel.sendToQueue(
      this.tasksQueue,
      Buffer.from(JSON.stringify(msg)),
      {
        persistent: true,
        priority,
      }
    );
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}

const mqInstance = new Mq();

module.exports = mqInstance;
