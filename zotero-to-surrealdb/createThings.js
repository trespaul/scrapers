import Surreal from "https://deno.land/x/surrealdb/mod.ts";

const db = new Surreal("http://127.0.0.1:8000/rpc");

await db.signin({
  user: "root",
  pass: "root",
});

await db.use("bib", "bib");

const things = await import("./library.json", {
  assert: { type: "json" },
});

const mkQuery = (item) => `
  SELECT id FROM person
    WHERE (
      family = "${item.family}"
      AND string::startsWith(given, "${item.given?.[0]}")
    )
    OR literal = "${item.literal}"
  ;
`;

const mkQuery2 = (item) => `
  SELECT id FROM person
    WHERE (
      family = "${item.family}"
      AND given = "${item.given}"
    )
  ;
`;

async function processThings(things) {
  for (const thing of things) {
    for (const field of ["author", "editor", "translator"]) {
      if (thing[field]) {
        const ids = await Promise.all(
          thing[field].map(async (item) => {
            let result = await db.query(mkQuery(item));
            if (result[0].result.length > 1) {
              result = await db.query(mkQuery2(item));
            }
            return result[0].result[0].id;
          })
        );
        thing[field] = ids;
      }
    }
    const result = await db.create(
      `thing:\`${thing["citation-key"]}\``, thing
    );
    console.log(result)
  }
}

await processThings(things.default);

close();
