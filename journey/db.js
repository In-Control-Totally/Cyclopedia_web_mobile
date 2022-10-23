const abortController = new AbortController();
const abortSignal = abortController.signal;

var stored_gps_data = []



window.addEventListener('load', (event) => {
    document.getElementById('idEndJourneyButton').addEventListener('click', handleAbort);
    document.getElementById('idStartJourneyButton').addEventListener('click', getPosition);
    document.getElementById('idStartJourneyButton').addEventListener('click', startCapture);
    getLocation();

});



function startCapture() {
    document.getElementById('idStartJourneyButton').setAttribute("disabled", "")
    document.getElementById('idStatusNotificationArea').appendChild(createNotification('Running', 'bg-info'))
}



function handleAbort() {
    abortController.abort();
    
    var transmission = {
        "journey": {
            "user_id": document.getElementById("iduser").value,
            "journey_start_time": stored_gps_data[0]["timestamp"],
            "journey_end_time": stored_gps_data[stored_gps_data.length - 1]["timestamp"]
        },
        "points": stored_gps_data
    };
    console.log(transmission);
    document.getElementById('notfication').remove();
    document.getElementById('idStatusNotificationArea').appendChild(createNotification('Submitting', 'bg-warning'));

//    postData('http://127.0.0.1:8000/journey/create', transmission)
            postData('https://api-dev.cyclopedia.goldenrivet.xyz/journey/create', transmission)
        .then((response) => {

                stored_gps_data = [];
                if (response.status == 200) {
                    document.getElementById('notfication').remove();
                    document.getElementById('idStatusNotificationArea').appendChild(createNotification('Submitted', 'bg-success'));
                } else {
                    document.getElementById('notfication').remove();
                    document.getElementById('idStatusNotificationArea').appendChild(createNotification('Failed - ' + response.status, 'bg-danger'));

                }
            }

        )
        .catch((err) => {
            document.getElementById('notfication').remove();
            document.getElementById('idStatusNotificationArea').appendChild(createNotification('Failed - Check console', 'bg-danger'));
            console.log(err);
        })

}

function createNotification(note_text, type_of_badge) {
    var new_element = document.createElement("span");
    new_element.classList.add("badge");
    new_element.classList.add(type_of_badge);
    new_element.setAttribute("id", "notfication");
    new_element.innerHTML = note_text;
    return new_element
}



function getPosition() {

    let runner = setTimeout(() => {
        getPosition2()
    }, 1000);
}


function getPosition2() {
    if (!abortSignal.aborted) {
        navigator.geolocation.getCurrentPosition((position) => {

            stored_gps_data.push({
                "latitude": String(position.coords.latitude),
                "longitude": String(position.coords.longitude),
                "altitude": 0,
                "timestamp": String(Math.trunc(position.timestamp / 1000))
            })
            getPosition();

        })
    }
}
