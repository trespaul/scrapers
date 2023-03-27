import Surreal from "https://deno.land/x/surrealdb/mod.ts";

const db = new Surreal('http://127.0.0.1:8000/rpc');

await db.signin({
	user: 'root',
	pass: 'root',
});

await db.use('bib', 'bib');

const people = await import("./people.json", {
  assert: { type: "json" },
});

let cleanName = str => str.replace(/\s/gm,"")
									        .replace("-","")
									        .replace("'","")
									        .normalize("NFD")
									        .replace(/\p{Diacritic}/gu, "")

async function processPeople() {
		for (let person of people.default) {
			let idBase = person.literal ?? person.family + person.given[0]
			let id = cleanName(idBase)
			try {
				console.log(
					await db.create(
						"person:" + id,
						person
					)
				)
			} catch (e) {
				console.log(
					// since there was only one collision, I actually
					// manually disambiguated with the full first names
					await db.create(
						"person:" + id + Math.random().toString(10).substr(2,3),
						person
					)
				)
			}
		}
}

processPeople();
close();
