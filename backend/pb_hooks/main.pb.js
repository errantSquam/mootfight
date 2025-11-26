/// <reference path="..\pb_data\types.d.ts" />
// pb_hooks/main.pb.js



//DOES NOT WORK: e.record.attack
//DOES WORK: e.record.get("attack")

//Note: in the hook you give it an ID to refer to a relation, not the entire object

$app.rootCmd.addCommand(new Command({
    use: "hello",
    run: (cmd, args) => {
        console.log("Hello world!")
    },
}))

onRecordAfterCreateSuccess((e) => {
    $app.logger().debug("Attack created!")

    let notifsCollection = $app.findCollectionByNameOrId("notifications")

    let attackRecord = e.record
    $app.expandRecord(attackRecord, ["characters"], null)


    let charactersRecord = attackRecord.expandedAll("characters")

    /*
    console.log("E1")
    console.log(JSON.stringify(attackRecord))
    console.log("E2")
    console.log(charactersRecord)
    console.log("E3")*/

    charactersRecord.map((chara) => {


        let notifRecord = new Record(notifsCollection)
        let notified_user = chara.get("owner")

        notifRecord.set("notified_user", notified_user)
        notifRecord.set("attack", attackRecord.get("id"))
        notifRecord.set("notif_type", "new_defence")

        if (notified_user !== attackRecord.get("attacker")) {
            $app.save(notifRecord)
        }

    }) 



    e.next()
}, "attacks")

onRecordAfterCreateSuccess((e) => {
    $app.logger().debug("Comment created!")
    $app.logger().debug(JSON.stringify(e))

    let notifsCollection = $app.findCollectionByNameOrId("notifications")

    let notifRecord = new Record(notifsCollection)
    let commentRecord = e.record

    let isNotif = false

    let notified_user = ''

    if (commentRecord.get("attack") !== undefined && commentRecord.get("attack") !== '') {

        //If replying to an attack
        $app.logger().debug("Creating attack notif...")

        let attackRecord = $app.findRecordById("attacks", commentRecord.get("attack"))
        notified_user = attackRecord.get("attacker")

        notifRecord.set("notified_user", notified_user)
        notifRecord.set("attack", attackRecord.get("id"))
        notifRecord.set("comment", commentRecord.get("id"))
        notifRecord.set("notif_type", "reply_attack")

        isNotif = true

    } else if (commentRecord.get("reply_to") !== undefined && commentRecord.get("reply_to") !== '') {
        let replyRecord = $app.findRecordById("comments", commentRecord.get("reply_to"))

        notified_user = replyRecord.get("user")

        notifRecord.set("notified_user", notified_user)
        notifRecord.set("comment", commentRecord.get("id"))
        notifRecord.set("notif_type", "reply_comment")

        isNotif = true

    }

    if (notified_user !== commentRecord.get("user") && isNotif) {
        $app.save(notifRecord)
    }
    e.next()
}, "comments")