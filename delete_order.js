function deleteOrder(orderID) {
    let confirmDelete = confirm(`Are you sure you want to delete Order ID: ${orderID}?`)
    if (confirmDelete) {
      var link = '/delete-order-ajax/';
      let data = {
        id: orderID
      };
    
      $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
          deleteRow(data.id);
        }
      })
    }
    
  function deleteRow(orderID){
      let table = document.getElementById("orders-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == orderID) {
              table.deleteRow(i);
              deleteDropDownMenu(orderID)
              break;
        }
      }
  }
}

function deleteDropDownMenu(orderID){
  let selectMenu = document.getElementById("update-orderID");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(orderID)){
      selectMenu[i].remove();
      break;
    } 

  }
}
