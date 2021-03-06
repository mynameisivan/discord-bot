const Enmap = require("enmap");
const patchHistory = new Enmap({name: 'patches'})
const readdir = require("fs").readdirSync;

function ensurePatch(patchName) {
  if (!patchHistory.ensure(patchName, false)) {
    console.log(`Applying patch ${patchName}`);
    const patch = require(`../patches/${patchName}`);
    try {
      patch.run();
    } catch (e) {
      console.log(`${patchName} failed to apply, rolling back`)
      patch.rollback();
      console.log(`${patchName} rolled back`)
      throw e;
    }
    patchHistory.set(patchName, true);
    console.log(`${patchName} applied successfully`);
  } else {
    console.log(`${patchName} already applied`);
  }
}

/**
 * Applies any patches (i.e. 1 time run commands), ensuring that they run successfully.
 * Please make sure that your patches are idempotent. 
 */
function applyPatches() {
  console.log(`patches begin`);
  // readdir uses process.cwd instead of __dirname, so use root dir as rel path.
  const patches = readdir("./patches");
  patches.sort((a, b) => a.substring(1) - b.substring(1));
  patches.forEach(patch => {
    ensurePatch(patch);
  });
  console.log(`patches end`);
}

module.exports.applyPatches = applyPatches
