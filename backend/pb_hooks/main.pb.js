/// <reference path="..\pb_data\types.d.ts" />
// pb_hooks/main.pb.js


$app.rootCmd.addCommand(new Command({
    use: "hello",
    run: (cmd, args) => {
        console.log("Hello world!")
    },
}))

onCollectionAfterCreateSuccess((e) => {
    console.log("Attack created!")
    e.next()
}, "attacks")