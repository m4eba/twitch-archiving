import { TaskData, TaskRequestMsg } from '@twitch-archiving/messages';
import { Task } from '@twitch-archiving/prisma/prisma/generated/rec-client';
import { randomStr } from '@twitch-archiving/utils';
import { Producer } from 'kafkajs';
import { sendData } from './index.js';
import { getRecPrismaClient } from './init.js';

export async function createTask<T extends TaskRequestMsg>(
  producer: Producer,
  task: T,
  topic: string,
  key: string,
  name: string,
  dependencies: string[]
): Promise<string> {
  const client = getRecPrismaClient();
  const data: TaskData<T> = {
    topic,
    key,
    data: task,
  };
  const tt = await client.task.create({
    data: {
      groupId: task.groupId,
      task: name,
      dependencies,
      data: data as any,
    },
  });
  task.taskId = tt.id.toString();

  async function go() {
    await start(BigInt(task.taskId));
    await sendData(producer, topic, {
      key: key.length === 0 ? randomStr() : key,
      value: JSON.stringify(task),
      timestamp: new Date().getTime().toString(),
    });
  }

  if (dependencies.length === 0) {
    // task has no dependencies, start right away
    await go();
  } else {
    // check dependencies
    const deps = new Set<string>(dependencies);
    const tasks = await client.task.findMany({
      where: {
        groupId: task.groupId,
      },
    });
    for (let i = 0; i < tasks.length; ++i) {
      if (tasks[i].completed === null) continue;
      deps.delete(tasks[i].task);
    }
    if (deps.size === 0) {
      await go();
    }
  }
  return name;
}

export async function start(id: bigint): Promise<Task> {
  const client = getRecPrismaClient();
  const task = await client.task.update({
    where: {
      id,
    },
    data: {
      started: new Date(),
    },
  });
  return task;
}

export async function complete(id: bigint): Promise<Task> {
  const client = getRecPrismaClient();
  const task = await client.task.update({
    where: {
      id,
    },
    data: {
      completed: new Date(),
    },
  });
  return task;
}
