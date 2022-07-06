import { TokenBucket } from "./tockenBucket.ts";
import { wait } from "./clock.ts";
import { asserts } from "./deps.ts";

const TIMING_EPSILON = 10;

Deno.test("TokenBucket", async (t) => {
  await t.step("is initialized empty", () => {
    const bucket = new TokenBucket({
      bucketSize: 10,
      tokensPerInterval: 1,
      interval: 100,
    });
    asserts.assertEquals(bucket.bucketSize, 10);
    asserts.assertEquals(bucket.tokensPerInterval, 1);
    asserts.assertEquals(bucket.content, 0);
  });

  await t.step("removing 10 tokens takes 1 second", async () => {
    const start = +new Date();
    const bucket = new TokenBucket({
      bucketSize: 10,
      tokensPerInterval: 1,
      interval: 100,
    });
    const remainingTokens = await bucket.removeTokens(10);

    const duration = +new Date() - start;
    const diff = Math.abs(1000 - duration);
    asserts.assert(diff < TIMING_EPSILON);
    asserts.assertEquals(remainingTokens, 0);
    asserts.assertEquals(bucket.content, 0);
  });

  await t.step("removing another 10 tokens takes 1 second", async () => {
    const bucket = new TokenBucket({
      bucketSize: 10,
      tokensPerInterval: 1,
      interval: 100,
    });
    await bucket.removeTokens(10);

    const start = +new Date();
    const remainingTokens = await bucket.removeTokens(10);
    const duration = +new Date() - start;
    const diff = Math.abs(1000 - duration);
    asserts.assert(diff < TIMING_EPSILON);
    asserts.assertEquals(remainingTokens, 0);
    asserts.assertEquals(bucket.content, 0);
  });

  await t.step("waiting 2 seconds gives us only 10 tokens", async () => {
    const bucket = new TokenBucket({
      bucketSize: 10,
      tokensPerInterval: 1,
      interval: 100,
    });
    await wait(2000);
    const start = +new Date();
    const remainingTokens = await bucket.removeTokens(10);
    const duration = +new Date() - start;
    asserts.assert(duration < TIMING_EPSILON);
    asserts.assertEquals(remainingTokens, 0);
  });

  await t.step("removing 1 token takes 100ms", async () => {
    const bucket = new TokenBucket({
      bucketSize: 10,
      tokensPerInterval: 1,
      interval: 100,
    });

    const start = +new Date();
    const remainingTokens = await bucket.removeTokens(1);
    const duration = +new Date() - start;
    const diff = Math.abs(100 - duration);
    asserts.assert(diff < TIMING_EPSILON);
    asserts.assert(remainingTokens < 1);
  });
});
