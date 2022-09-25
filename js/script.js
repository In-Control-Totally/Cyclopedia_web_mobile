function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(console.log);

    } else {
        //    x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

//Post POI data to the REST endpoint
function postPOIData(name, desc) {
    postData("https://api-dev.cyclopedia.goldenrivet.xyz/poi/create_def", {
            "poi_type": name.value,
            "poi_desc": desc.value
        })
        .then((response) => response.json())
        .then((jsondata) => {
            name.value = "";
            desc.value = "";
            enableAllInput();
            document.getElementById("id_returnmsg").innerHTML = `Added ${jsondata.poi_type_name} OK`;
        })


}

async function postData(url = '', data = {}) {
    // Default options are marked with *
    jsond = JSON.stringify(data);
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
            "Content-type": "application/json"
        },

        body: jsond
    });
    return response
}


function collectInputElements() {
    const input_types_to_disable = ["input", "textarea", "button", "select"];
    var inputs_to_disable = [];
    for (element_type of input_types_to_disable) {
        var elements = document.getElementsByTagName(element_type);
        if (elements.length > 0) {
            inputs_to_disable = inputs_to_disable.concat(elements);
        }
    }
}

function disableAllInput() {
    var inputs_to_disable = collectInputElements();
    for (item in inputs_to_disable) {
        inputs_to_disable[item][0].classList.add("disabled");
        inputs_to_disable[item][0].setAttribute("disabled", "");

    }

}

function createSpinner() {
    var new_element = document.createElement("div")
    new_element.classList.add("spinner-border");
    new_element.setAttribute("id", "idplzwait");
    return new_element
}

async function getPOIData() {

    const out = await fetch('https://api-dev.cyclopedia.goldenrivet.xyz/poi/show_all_types')
    return out
}

function createOption(option_no, text) {
    const return_element = document.createElement("option");
    return_element.innerHTML = text;
    return_element.value = option_no;
    return return_element
}


function populateDataTypesDropDown() {

    getPOIData()
        .then((response) => response.json())
        .then((data) => {
            for (item of data) {
                var opt = createOption(item.poi_type_id, item.poi_type_name);
                document.getElementById("id_typeselect").appendChild(opt);
            }
        });
}

function submitPOI() {
    disableAllInput();
    document.getElementById("id_returnmsg").appendChild(createSpinner());
    var poi_type_id = document.getElementById("id_typeselect").value;
    navigator.geolocation.getCurrentPosition((position) => {
        postData('https://api-dev.cyclopedia.goldenrivet.xyz/poi/create', {
                "poi_type_id": poi_type_id,
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude,
                "altitude": 0,
                "comments": String(document.getElementById("idcomments").value)

            })
            .then((response) => response.json())
            .then((json) => {
                document.getElementById("idplzwait").remove();
                document.getElementById("idcomments").value = "";
                enableAllInput();
                document.getElementById("id_returnmsg").innerHTML = `Created OK: ${JSON.stringify(json)}`;
                
            
            });

    });

}

function enableAllInput() {
    var inputs_to_enable = collectInputElements();
    for (item in inputs_to_enable) {
        inputs_to_enable[item][0].classList.remove("disabled");
        inputs_to_enable[item][0].removeAttribute("disabled", "");

    }
}
