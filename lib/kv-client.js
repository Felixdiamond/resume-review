import { kv } from "@vercel/kv";

class LocalKV {
  constructor() {
    this.store = new Map();
  }

  async set(key, value) {
    console.log(`LocalKV: Setting ${key}`);
    this.store.set(key, JSON.stringify(value));
  }

  async get(key) {
    console.log(`LocalKV: Getting ${key}`);
    const value = this.store.get(key);
    return value ? JSON.parse(value) : null;
  }
}

const localKV = new LocalKV();

export const kvClient = process.env.NODE_ENV === "production" ? kv : localKV;

export async function storeAnalysis(id, analysis) {
  try {
    const key = `analysis:${id}`;
    await kvClient.set(key, analysis);
    console.log(`Analysis stored successfully for id: ${id}`);
  } catch (error) {
    console.error(`Error storing analysis for id ${id}:`, error);
    throw error;
  }
}

export async function getAnalysis(id) {
  try {
    const key = `analysis:${id}`;
    const analysis = await kvClient.get(key);
    if (!analysis) {
      console.log(`Analysis not found for id: ${id}`);
    }
    return analysis;
  } catch (error) {
    console.error(`Error retrieving analysis for id ${id}:`, error);
    throw error;
  }
}