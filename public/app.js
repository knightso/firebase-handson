
/**
 * Initializes rooms select.
 */
function initRooms() {
    const roomsSelect = document.getElementById('rooms');

    // clear options
    const roomsLen = roomsSelect.options.length;
    for (let i = roomsLen - 1; i > 0; i--) {
        roomsSelect.remove(i);
    }
    roomsSelect.options.length = 0; // just in case

    const db = firebase.firestore();

    db.collection("rooms")
        .get()
        .then(function(querySnapshot) {
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
