import { createSeedClient } from "@snaplet/seed";
import { copycat as cp } from "@snaplet/copycat";
import bcrypt from "bcrypt";

const client = await createSeedClient({
  models: {
    user: {
      data: {
        id: ({ seed }) => cp.uuid(seed),
        username: ({ seed }) => cp.username(seed),
        name: "admin",
        role: "admin",
        email: ({ seed }) => cp.email(seed),
        password: bcrypt.hashSync("admin", 10)
      }
    },
    customer: {
      data: {
        id: ({ seed }) => cp.uuid(seed)
      }
    },
    order: {
      data: {
        id: ({ seed }) => cp.uuid(seed)
      }
    },
    product: {
      data: {
        id: ({ seed }) => cp.int(seed, { max: 1000 })
      }
    }
  }
});

await client.$resetDatabase();

// await client.order((x) => x(40));
await client.user((x) => x(1));
await client.productOrder((x) => x(10));

process.exit();
