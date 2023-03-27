# Getting Zotero library into SurrealDB

I'm currently playing with using a custom library manging setup.
I love Zotero but sometimes it's a bit clunky and limited.
This just puts the Zotero library into SurrealDB.

1. export as CSL JSON from Zotero to `library.json`.
2. get people with

  ```zsh
  jq '[.[].author[]?, .[].editor[]?, .[].translator[]?] | unique' library.json > people.json`
  ```

3. Manually check (eh, what can you do). List possible duplicates with

  ```zsh
  `jq '.[].family?' people.json | sort | uniq -d`
  ```

5. run createPeople with deno to add people to SurrealDB.
6. run createThings with deno to add the library entries to SurrealDB (but check for errors like name conflicts etc. first).
