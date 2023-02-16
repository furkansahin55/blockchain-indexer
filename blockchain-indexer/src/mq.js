const amqplib = require("amqplib");
const { MQ_URL } = require("./config");

class Mq {
  /**
   * Connect to RabbitMQ
   * @returns {Promise<void>}
   */
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

    await channel.prefetch(1);
  }

  /**
   * Bind a function to the tasks queue
   * @param fnc
   * @returns {Promise<void>}
   */
  async bindTaskConsumeFunction(fnc) {
    await this.channel.consume(this.tasksQueue, fnc);
  }

  /**
   * Send a task to the queue
   * @param id
   * @param args
   * @param priority
   * @returns {Promise<void>}
   */
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

  /**
   * Close the connection to the queue
   * @returns {Promise<void>}
   */
  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}

module.exports = Mq;
