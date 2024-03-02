let updateOrderForm = document.getElementById('update-order-form-ajax');

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let orderID = document.getElementById("update-orderID");
    let delivererID = document.getElementById("update-delivererID");
    let restaurantID = document.getElementById("update-restaurantID");
    let customerID = document.getElementById("update-customerID");
    let deliveryAddress = document.getElementById("update-deliveryAddress");
    let deliveryStatus = document.getElementById("update-deliveryStatus");
    let deliveryTime = document.getElementById("update-deliveryTime");
    let specialInstructions = document.getElementById("update-specialInstructions");
    let totalFee = document.getElementById("update-totalFee");

    // Get the values from the form fields
    let orderIDValue = orderID.value;
    let delivererIDValue = delivererID.value;
    let restaurantIDValue = restaurantID.value;
    let customerIDValue = customerID.value;
    let deliveryAddressValue = deliveryAddress.value;
    let deliveryStatusValue = deliveryStatus.value;
    let deliveryTimeValue = deliveryTime.value;
    let specialInstructionsValue = specialInstructions.value;
    let totalFeeValue = totalFee.value;
    console.log(delivererID.value)
    // Check if NULL values
    if (deliveryAddress.value == null){
        return;
    }
    if (totalFee.value == null){
        return;
    }

    if (delivererIDValue.length == 0 ){
        delivererIDValue = null
    };

    if (restaurantIDValue.length == 0){
        restaurantIDValue = null
    }


    // Put our data we want to send in a javascript object
    let data = {
        orderID: orderIDValue,
        delivererID: delivererIDValue,
        restaurantID: restaurantIDValue,
        customerID: customerIDValue,
        deliveryAddress: deliveryAddressValue,
        deliveryStatus: deliveryStatusValue,
        deliveryTime: deliveryTimeValue,
        specialInstructions: specialInstructionsValue,
        totalFee: totalFeeValue
    }
    
    // Confirms with user
    let confirmEdit = confirm(`Are you sure you want to make changes for this order? \n\n Order Change Details:\n\n Order ID: ${orderIDValue} \n Deliverer ID: ${delivererIDValue} \n Restaurant ID: ${restaurantIDValue} \n Customer ID: ${customerIDValue} \n Delivery Address: ${deliveryAddressValue} \n Delivery Status: ${deliveryStatusValue} \n Delivery Time: ${deliveryTimeValue} \n Special Instructions: ${specialInstructionsValue} \n Total Fee: ${totalFeeValue}`)
    if (confirmEdit) {
        // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");


    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Update the new data to the table
            updateRowToTable(xhttp.response, orderIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    }
})

updateRowToTable = (data, orderID) => {
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("orders-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get values
            let deliverer = updateRowIndex.getElementsByTagName("td")[1];
            let restaurant = updateRowIndex.getElementsByTagName("td")[2];
            let customer = updateRowIndex.getElementsByTagName("td")[3];
            let address = updateRowIndex.getElementsByTagName("td")[4];
            let status = updateRowIndex.getElementsByTagName("td")[5];
            let time = updateRowIndex.getElementsByTagName("td")[6];
            let instructions = updateRowIndex.getElementsByTagName("td")[7];
            let fee = updateRowIndex.getElementsByTagName("td")[8];

            // Reassign to our value we updated to
            deliverer.innerHTML = parsedData[0].delivererID; 
            restaurant.innerHTML = parsedData[0].restaurantID;
            customer.innerHTML = parsedData[0].customerID;
            address.innerHTML = parsedData[0].deliveryAddress;
            status.innerHTML = parsedData[0].deliveryStatus;
            time.innerHTML = parsedData[0].deliveryTime;
            instructions.innerHTML = parsedData[0].specialInstructions;
            fee.innerHTML = parsedData[0].totalFee;
       }
    }
};

/* --------------------------------------------------------------------
    On-click order button:
    Populates the order form with the values of the row.
-------------------------------------------------------------------- */

function editOrder(orderID){
    // Put our data we want to send in a javascript object
    let id = {
        orderID: orderID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/get-order-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");


    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Update the form with new values
            editForm(xhttp.response, orderID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error retrieving the row values.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(id))};

// Input values into our form
editForm = (data, orderID) => {
    let rowData = JSON.parse(data);
    
    // Get form fields
    let orderIDSelect = document.getElementById("update-orderID");
    let delivererIDSelect = document.getElementById("update-delivererID");
    let restaurantIDSelect = document.getElementById("update-restaurantID");
    let customerIDSelect = document.getElementById("update-customerID");
    let deliveryAddressInput = document.getElementById("update-deliveryAddress");
    let deliveryStatusInput = document.getElementById("update-deliveryStatus");
    let deliveryTimeInput = document.getElementById("update-deliveryTime");
    let specialInstructionsInput = document.getElementById("update-specialInstructions");
    let totalFeeInput = document.getElementById("update-totalFee");

    // Gets the value form the data row
    let orderIDValue = rowData[0].orderID;
    let delivererIDValue = rowData[0].delivererID;
    let restaurantIDValue =rowData[0].restaurantID;
    let customerIDValue = rowData[0].customerID;
    let deliveryAddressValue = rowData[0].deliveryAddress;
    let deliveryStatusValue = (rowData[0].deliveryStatus);
    let deliveryTimeValue = rowData[0].deliveryTime;
    let specialInstructionsValue = rowData[0].specialInstructions;
    let totalFeeValue = rowData[0].totalFee;


    // Convert time to inputtable format if not 0000-00-00T00:00:00
    if (deliveryTimeValue != "0000-00-00 00:00:00"){
        curDate = new Date (deliveryTimeValue)

        let year = curDate.getFullYear();
        let month = ("0" + (curDate.getMonth() + 1)).slice(-2);
        let day = ("0" + curDate.getDate()).slice(-2);
        let hours = ("0" + curDate.getHours()).slice(-2);
        let minutes = ("0" + curDate.getMinutes()).slice(-2);
        let seconds = ("0" + curDate.getSeconds()).slice(-2);

        deliveryTimeValue = year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds; 
    };
    // If values are null, set to default value
    if (delivererIDValue == null){
        delivererIDValue = ""
    };
    if (restaurantIDValue == null){
        restaurantIDValue = ""
    };
    if (specialInstructionsValue == null){
        specialInstructionsValue = ""
    };

    // Set form field values to row data.
    orderIDSelect.value = orderIDValue;
    delivererIDSelect.value = delivererIDValue;
    restaurantIDSelect.value = restaurantIDValue;
    customerIDSelect.value = customerIDValue;
    deliveryAddressInput.value = deliveryAddressValue;
    deliveryStatusInput.value = deliveryStatusValue;
    deliveryTimeInput.value = deliveryTimeValue;
    specialInstructionsInput.value = specialInstructionsValue;
    totalFeeInput.value = totalFeeValue;

    };
