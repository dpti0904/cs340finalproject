let addOrderForm = document.getElementById('add-order-form-ajax');

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let delivererID = document.getElementById("delivererID");
    let restaurantID = document.getElementById("restaurantID");
    let customerID = document.getElementById("customerID");
    let deliveryAddress = document.getElementById("deliveryAddress");
    let deliveryStatus = document.getElementById("deliveryStatus");
    let deliveryTime = document.getElementById("deliveryTime");
    let specialInstructions = document.getElementById("specialInstructions");
    let totalFee = document.getElementById("totalFee");

    // Get the values from the form fields
    let delivererIDValue = delivererID.value;
    let restaurantIDValue = restaurantID.value;
    let customerIDValue = customerID.value;
    let deliveryAddressValue = deliveryAddress.value;
    let deliveryStatusValue = deliveryStatus.value;
    let deliveryTimeValue = deliveryTime.value;
    let specialInstructionsValue = specialInstructions.value;
    let totalFeeValue = totalFee.value;

    // Put our data we want to send in a javascript object
    let data = {
        delivererID: delivererIDValue,
        restaurantID: restaurantIDValue,
        customerID: customerIDValue,
        deliveryAddress: deliveryAddressValue,
        deliveryStatus: deliveryStatusValue,
        deliveryTime: deliveryTimeValue,
        specialInstructions: specialInstructionsValue,
        totalFee: totalFeeValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            delivererID.value = '';
            restaurantID.value = '';
            customerID.value = '';
            deliveryAddress.value = '';
            deliveryStatus.value = '';
            deliveryTime.value = '';
            specialInstructions.value = '';
            totalFee.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("orders-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 9 cells
    let row = document.createElement("TR");
    row.className = "newtr"

    let orderIDCell = document.createElement("TD");
    let delivererIDCell = document.createElement("TD");
    let restaurantIDCell = document.createElement("TD");
    let customerIDCell = document.createElement("TD");
    let deliveryAddressCell = document.createElement("TD");
    let deliveryStatusCell = document.createElement("TD");
    let deliveryTimeCell = document.createElement("TD");
    let specialInstructionsCell = document.createElement("TD");
    let totalFeeCell = document.createElement("TD");
    let editCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    orderIDCell.innerText = newRow.orderID;
    delivererIDCell.innerText = newRow.delivererID;
    restaurantIDCell.innerText = newRow.restaurantID;
    customerIDCell.innerText = newRow.customerID;
    deliveryAddressCell.innerText = newRow.deliveryAddress;
    deliveryStatusCell.innerText = newRow.deliveryStatus;
    deliveryTimeCell.innerText = newRow.deliveryTime;
    specialInstructionsCell.innerText = newRow.specialInstructions;
    totalFeeCell.innerText = newRow.totalFee;

    editCell.innerText = "Edit";
    editCell.className = "newchange";
    editCell.onclick = function(){
        editOrder(newRow.orderID)
    };

    deleteCell.innerText = "Delete";
    deleteCell.className = "newchange";
    deleteCell.onclick = function(){
        deleteOrder(newRow.orderID)
    };

    // Add the cells to the row 
    row.appendChild(orderIDCell);
    row.appendChild(delivererIDCell);
    row.appendChild(restaurantIDCell);
    row.appendChild(customerIDCell);
    row.appendChild(deliveryAddressCell);
    row.appendChild(deliveryStatusCell);
    row.appendChild(deliveryTimeCell);
    row.appendChild(specialInstructionsCell);
    row.appendChild(totalFeeCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell);
    
    row.setAttribute('data-value', newRow.orderID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("update-orderID");
    let option = document.createElement("option");
    option.text = newRow.orderID
    option.value = newRow.orderID;
    selectMenu.add(option);
}
