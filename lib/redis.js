import Redis from 'ioredis'

const redis = new Redis('rediss://default:AekJAAIjcDE4YzAwYThlYjI0MTY0MmIzOTQzMjg2OTEyZGExMzE3ZHAxMA@touched-warthog-59657.upstash.io:6379')

const initialData = {
  "1702459181837": '{"title":"sunt aut","content":"quia et suscipit suscipit recusandae","updateTime":"2023-12-13T09:19:48.837Z"}',
  "1702459182837": '{"title":"qui est","content":"est rerum tempore vitae sequi sint","updateTime":"2023-12-13T09:19:48.837Z"}',
  "1702459188837": '{"title":"ea molestias","content":"et iusto sed quo iure","updateTime":"2023-12-13T09:19:48.837Z"}'
}

export async function getAllNotes() {
  const data = await redis.hgetall("notes");
  if (Object.keys(data).length == 0) {
    await redis.hset("notes", initialData);
  }
  // const res = await redis.hgetall("notes")
  // 将res返回的结果按照时间upDateTime倒序排序
  const sortedData = Object.entries(data)
  .map(([key, value]) => [key, JSON.parse(value)])
  .sort((a, b) => new Date(b[1].updateTime) - new Date(a[1].updateTime));
  const sortedObj = Object.fromEntries(sortedData);
  return sortedObj
}

export async function addNote(data) {
  const uuid = Date.now().toString();
  await redis.hset("notes", [uuid], data);
  return uuid
}

export async function updateNote(uuid, data) {
  await redis.hset("notes", [uuid], data);
}

export async function getNote(uuid) {
  return JSON.parse(await redis.hget("notes", uuid));
}

export async function delNote(uuid) {
  return redis.hdel("notes", uuid)
}

export default redis
