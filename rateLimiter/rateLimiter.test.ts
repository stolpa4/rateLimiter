import { RateLimiter } from "./rateLimiter.ts";
import { Interval } from "./tokenBucket.ts";
import { asserts } from "./deps.ts";

Deno.test("RateLimiter", async (t) => {
  await t.step("Invalid interval", () => {
    const junkInterval = ("junk" as unknown) as Interval;
    asserts.assertThrows(() =>
      new RateLimiter({ tokensPerInterval: 1, interval: junkInterval })
    );
  });

  await t.step("Valid interval", () => {
    asserts.assert(new RateLimiter({ tokensPerInterval: 1, interval: "sec" }));
    asserts.assert(
      new RateLimiter({ tokensPerInterval: 1, interval: "second" }),
    );
    asserts.assert(new RateLimiter({ tokensPerInterval: 1, interval: "min" }));
    asserts.assert(
      new RateLimiter({ tokensPerInterval: 1, interval: "minute" }),
    );
    asserts.assert(new RateLimiter({ tokensPerInterval: 1, interval: "hr" }));
    asserts.assert(new RateLimiter({ tokensPerInterval: 1, interval: "hour" }));
    asserts.assert(new RateLimiter({ tokensPerInterval: 1, interval: "day" }));
  });
});
