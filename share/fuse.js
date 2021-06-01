const { FuseBox, JSONPlugin, Sparky } = require("fuse-box");

const fuse = FuseBox.init({
    homeDir: "./src",
    output: "./$name.bundle.js",
    target: "server@esnext",
    useTypescriptCompiler: true,
    plugins: [ JSONPlugin() ],
});


Sparky.task("run", async () => {
    fuse.bundle("share")
        .instructions(">Main.ts")
        .completed(proc => proc.start());
    fuse.run();
})

Sparky.task("build", () => {
    fuse.bundle("share")
        .instructions(">Main.ts");
    fuse.run();
})