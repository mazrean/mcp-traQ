import { Apis, Configuration } from "npm:@traptitech/traq";

// Types
type Messages = {
  userId: string;
  channelId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  stamps: {
    userId: string;
    stampId: string;
    createdAt: string;
  }[];
};

type User = {
  id: string;
  name: string;
  displayName: string;
  bot: boolean;
};

type Channel = {
  id: string;
  name: string;
  topic: string | null;
};

type Stamp = {
  id: string;
  name: string;
  creatorId: string;
  isUnicode: boolean;
};

type Pin = {
  userId: string;
  pinnedAt: string;
};

export type Client = Apis;

// Client creation
export const createBotClient = (token: string) => {
  const config = new Configuration({
    accessToken: token,
    basePath: "https://q.trap.jp/api/v3",
  });
  return new Apis(config);
};

// Message related functions
export const searchMessages = async (
  client: Apis,
  limit: number,
  after?: Date,
  before?: Date,
  words?: string,
  channelId?: string,
  to?: string[],
  from?: string[],
  offset?: number,
  sort?: "createdAt" | "-createdAt" | "updatedAt" | "-updatedAt" | undefined,
  includeBot?: boolean
): Promise<Messages[]> => {
  const response = await client.searchMessages(
    words,
    after?.toISOString(),
    before?.toISOString(),
    channelId,
    to,
    from,
    undefined,
    includeBot,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    limit,
    offset,
    sort
  );
  if (response.status !== 200) {
    throw new Error(`Failed to get messages: ${response.statusText}`);
  }

  return response.data.hits.map((message) => {
    return {
      userId: message.userId,
      channelId: message.channelId,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      stamps: message.stamps.map((stamp) => {
        return {
          userId: stamp.userId,
          stampId: stamp.stampId,
          createdAt: stamp.createdAt,
        };
      }),
    };
  });
};

// Channel related functions
export const getChannels = async (
  client: Apis,
  path?: string,
  limit?: number
): Promise<Channel[]> => {
  const response = await client.getChannels(false);
  if (response.status !== 200) {
    throw new Error(`Failed to get channels: ${response.statusText}`);
  }
  const channels = response.data.public;

  // チャンネルをMapに格納して効率的にアクセスできるようにする
  const channelMap = new Map(channels.map((c) => [c.id, c]));

  // パスのキャッシュを保持するMap
  const pathCache = new Map<string, string>();

  // チャンネルの完全なパス名を生成する（メモ化あり）
  const getFullPath = (channel: {
    id: string;
    name: string;
    parentId: string | null;
  }): string => {
    // キャッシュにある場合はそれを返す
    const cached = pathCache.get(channel.id);
    if (cached) return cached;

    // 親がない場合は自身の名前のみ
    if (!channel.parentId) {
      const path = channel.name;
      pathCache.set(channel.id, path);
      return path;
    }

    // 親のパスを取得して結合
    const parent = channelMap.get(channel.parentId);
    if (!parent) {
      const path = channel.name;
      pathCache.set(channel.id, path);
      return path;
    }

    const path = `${getFullPath(parent)}/${channel.name}`;
    pathCache.set(channel.id, path);
    return path;
  };

  return channels
    .map((channel) => ({
      id: channel.id,
      name: getFullPath(channel),
      topic: channel.topic,
    }))
    .filter((channel) => {
      if (path) {
        return channel.name.startsWith(path);
      }
      return true;
    })
    .slice(0, limit);
};

export const getChannelTopic = async (
  client: Apis,
  channelId: string
): Promise<string> => {
  const response = await client.getChannelTopic(channelId);
  if (response.status !== 200) {
    throw new Error(`Failed to get channel topic: ${response.statusText}`);
  }
  return response.data.topic;
};

// User related functions
export const getUser = async (client: Apis, userId: string): Promise<User> => {
  const response = await client.getUser(userId);
  if (response.status !== 200) {
    throw new Error(`Failed to get user: ${response.statusText}`);
  }
  return response.data;
};

export const getUsers = async (client: Apis): Promise<User[]> => {
  const response = await client.getUsers();
  if (response.status !== 200) {
    throw new Error(`Failed to get users: ${response.statusText}`);
  }
  return response.data;
};

// Stamp related functions
export const getStamps = async (client: Apis): Promise<Stamp[]> => {
  const response = await client.getStamps();
  if (response.status !== 200) {
    throw new Error(`Failed to get stamps: ${response.statusText}`);
  }
  return response.data;
};

// Pin related functions
export const getPins = async (
  client: Apis,
  channelId: string
): Promise<Pin[]> => {
  const response = await client.getChannelPins(channelId);
  if (response.status !== 200) {
    throw new Error(`Failed to get pins: ${response.statusText}`);
  }
  return response.data;
};
