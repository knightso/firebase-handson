
/**
 * Initializes rooms select.
 */
function initRooms() {

    // clear room messages
    handleChangeRoom(undefined);

    const roomsSelect = document.getElementById('rooms');

    const db = firebase.firestore();

    db.collection("rooms")
        .get()
        .then(function(querySnapshot) {
            // clear options
            const roomsLen = roomsSelect.options.length;
            for (let i = roomsLen - 1; i > 0; i--) {
                roomsSelect.remove(i);
            }
            roomsSelect.options.length = 1; // just in case

            querySnapshot.forEach(function(roomRef) {
                const room = roomRef.data();
                const option = document.createElement("option");
                option.text = room.name;
                option.value = roomRef.id;
                roomsSelect.appendChild(option);
            });
        })
        .catch(function(error) {
            window.alert(`Error getting rooms: ${error}`);
        });
};

/**
 * Submit chat message.
 */
function submitMsg(msg) {
    if (!signedInUser) {
        window.alert('signed-in user not found');
        return;
    }

    const roomId = document.getElementById('rooms').value;

    if (!roomId) {
        window.alert('room is not selected.');
        return;
    }

    let db = firebase.firestore();

    let message = {
        from: {
            uid: signedInUser.uid,
            //email: signedInUser.email,
            displayName: signedInUser.displayName
        },
        text: msg,
        createdAt: firebase.firestore.FieldValue.serverTimestamp() // サーバー側でタイムスタンプ付与（タイムラグあり）
    };

    db.collection("rooms").doc(roomId).collection("messages").add(message)
        .catch(function(error) {
            window.alert(`Error submitting message: ${error}`);
        });
}

/**
 * handle change room event.
 */
function handleChangeRoom(roomId) {

    const msgsDiv = document.getElementById('msgs');

    msgsDiv.innerHTML = '';

    if (!roomId) {
        return;
    }

    if (!signedInUser) {
        window.alert('signed-in user not found');
        return;
    }

    const msgTmpl = document.getElementById('msg-template');

    let db = firebase.firestore();

    db.collection("rooms").doc(roomId).collection("messages").orderBy("createdAt")
        .get()
        .then(function(querySnapshot) {
            msgsDiv.innerHTML = '';

            querySnapshot.forEach(function(msgRef) {
                const msg = msgRef.data();
                const msgDiv = msgTmpl.content.cloneNode(true);
                msgDiv.querySelector('.msg-from').innerText = `${msg.from.displayName || 'Anonymous'}: `;
                msgDiv.querySelector('.msg-text').innerText = msg.text;
                msgsDiv.appendChild(msgDiv);
            })
        })
        .catch(function(error) {
            window.alert(`Error getting messages: ${error}`);
        });
}

/**
 * Initializes the chat feature.
 */
function initChat() {
    document.getElementById('submit-msg-button').addEventListener('click', function() {
        const msg = document.getElementById('submit-msg-text').value;
        if (msg) {
            submitMsg(msg);
            document.getElementById('submit-msg-text').value = '';
        }
    });

    document.getElementById('rooms').addEventListener('change', function(e) {
        handleChangeRoom(e.target.value);
    });
}

window.addEventListener('load', initChat);
