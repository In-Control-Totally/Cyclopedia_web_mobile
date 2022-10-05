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
}



function handleAbort() {
    abortController.abort();
    
    var transmission = {
        "journey": {
            "user_id": 1,
            "journey_start_time": stored_gps_data[0]["timestamp"],
            "journey_end_time": stored_gps_data[stored_gps_data.length - 1]["timestamp"]
        },
        "points": stored_gps_data
    };
    console.log(transmission);
    
    postData('https://api-dev.cyclopedia.goldenrivet.xyz/journey/create', transmission)
    //postData('http://127.0.0.1:8000/journey/create', transmission)
}



function getPosition() {

    let runner = setTimeout(() => {
            getPosition2()
        }
        , 1000);
}


function getPosition2() {
    if (!abortSignal.aborted) {
        navigator.geolocation.getCurrentPosition((position) => {
                    console.log(stored_gps_data);
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
