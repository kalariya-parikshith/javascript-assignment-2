var numberOfTables = 5;
var tableOrders;
var tableClicked;

createTables = function() {
	for(tableIndex = 1; tableIndex <= numberOfTables; tableIndex++) {
		var newTable = document.createElement('DIV');
		newTable.className = "table";
		newTable.id = tableIndex;
		newTable.innerHTML = "Table "+ (tableIndex) + "<br>Rs. 0 | Total items: 0";
		document.getElementById('tablesDiv').appendChild(newTable);
	}
}
createTables();

createTableOrdersArray = function() {
	tableOrders = new Array();
	for(tableIndex = 0; tableIndex <= numberOfTables; tableIndex++) {
		tableOrders.push(new Array());
	}
}
createTableOrdersArray();

getItemName = function(itemId) {
	var itemName;
	items.items.forEach(function(obj) {
		if(parseInt(obj.id) == parseInt(itemId)) {
			itemName = obj.name;
		}
	});
	return itemName;
}

getItemPrice = function(itemId) {
	var itemPrice;
	items.items.forEach(function(obj) {
		if(parseInt(obj.id) == parseInt(itemId)) {
			itemPrice = obj.rate;
		}
	});
	return parseInt(itemPrice);
}

getNthItemIdOnTable = function(tableNumber, NthItem) {
	var itemId = tableOrders[tableNumber][NthItem].split(",")[0];
	return parseInt(itemId);
}

getNthItemNameOnTable = function(tableNumber, NthItem) {
	var itemId = getNthItemIdOnTable(tableNumber, NthItem);
	return getItemName(itemId);
}

getNthItemPriceOnTable = function(tableNumber, NthItem) {
	var itemId = getNthItemIdOnTable(tableNumber, NthItem);
	return getItemPrice(itemId);
}

getNthItemServingOnTable = function(tableNumber, NthItem) {
	var noOfServings = tableOrders[tableNumber][NthItem].split(",")[1];
	return parseInt(noOfServings);
}

setNthItemServingOnTable = function(tableNumber, NthItem, numberOfServingOfNthItem) {
	tableOrders[tableNumber][NthItem] = 
			getNthItemIdOnTable(tableNumber, NthItem) +','+ numberOfServingOfNthItem;
}

isItemPresentOnTable = function(tableNumber, itemId) {
	for(var NthItem = 0; NthItem < tableOrders[tableNumber].length; NthItem++) {
		if(getNthItemIdOnTable(tableNumber, NthItem) == parseInt(itemId)) {
			return true;
		}
	}
	return false;
}

incrementItemServingOnTable = function(tableNumber, itemId) {
	for(var NthItem = 0; NthItem < tableOrders[tableNumber].length; NthItem++) {
		if(getNthItemIdOnTable(tableNumber, NthItem) == parseInt(itemId)) {
			var noOfServings = getNthItemServingOnTable(tableNumber, NthItem);
			noOfServings++;
			tableOrders[tableNumber][NthItem] = itemId +","+ noOfServings;
		}
	}
}

getTotalBillOfATable = function(tableNumber) {
	var totalBill = 0;
	for(var NthItem=0; NthItem<tableOrders[tableNumber].length; NthItem++){
		totalBill += getNthItemPriceOnTable(tableNumber, NthItem)*getNthItemServingOnTable(tableNumber, NthItem);
	}
	return totalBill;
}

getTotalNumberOfItemsOnTable = function(tableNumber) {
	return tableOrders[tableNumber].length;
}

displayBillAndNumberOfItemsOnTable = function(tableNumber, totalBill, totalItems) {
	document.getElementById(tableNumber).innerHTML = "Table "+ (tableNumber) + "<br>Rs. "+totalBill+" | Total items: "+totalItems;
}

document.addEventListener("dragstart", function(event) {
	event.dataTransfer.setData("itemId",event.target.id);
},false);

document.addEventListener("dragover", function(event) {
	event.preventDefault();
});

document.addEventListener("drop", function(event) {
	event.preventDefault();
	var tableNumber = event.target.id;
	var itemId = event.dataTransfer.getData("itemId");

	if(isItemPresentOnTable(tableNumber, itemId)) {
		incrementItemServingOnTable(tableNumber, itemId);
	}
	else {
		tableOrders[parseInt(tableNumber)].push(itemId+","+"1");
	}

	var totalBill = getTotalBillOfATable(tableNumber);
	var totalItems = getTotalNumberOfItemsOnTable(tableNumber);
	displayBillAndNumberOfItemsOnTable(tableNumber, totalBill, totalItems);
},false);


addHeaderForOrderDetails = function() {
	var tableRow = document.createElement('TR');
	tableRow.id = 'tableHead';
	document.getElementById('orderDetailsTable').appendChild(tableRow);

	var serialNumberHead = document.createElement('TH');
	serialNumberHead.innerHTML="Serial No.";
	document.getElementById('tableHead').appendChild(serialNumberHead);

	var itemNameHead = document.createElement('TH');
	itemNameHead.innerHTML="Item";
	document.getElementById('tableHead').appendChild(itemNameHead);

	var priceHead = document.createElement('TH');
	priceHead.innerHTML="Price";
	document.getElementById('tableHead').appendChild(priceHead);

	var servingHead = document.createElement('TH');
	servingHead.innerHTML="No. of Servings";
	document.getElementById('tableHead').appendChild(servingHead);

	var removeItem = document.createElement('TH');
	removeItem.innerHTML="remove";
	document.getElementById('tableHead').appendChild(removeItem);
}
removeItemOnTable = function(tableNumber, NthItem) {
	tableOrders[tableNumber].splice(NthItem,1);
	displayTableDetails(tableNumber);
}

removeAllItemsOnTable = function(tableNumber) {
	while(tableOrders[tableNumber].length > 0) {
		removeItemOnTable(tableNumber, 0);
	}
}

updateServing = function(tableNumber, NthItem) {
	var numberOfServingOfNthItem = document.getElementById('itemServing'+NthItem).value;
	setNthItemServingOnTable(tableNumber, NthItem, numberOfServingOfNthItem);
	displayTableDetails(tableNumber);
}

detailsOfItemsOnTable = function(tableNumber, NthItem) {
	var itemDetailsOnTable = document.createElement('TR');
    itemDetailsOnTable.id = "itemOnTable"+NthItem;
    document.getElementById('orderDetailsTable').appendChild(itemDetailsOnTable);

    var serialNumberOnTable = document.createElement('TD');
    serialNumberOnTable.innerHTML = NthItem+1;
    document.getElementById('itemOnTable'+NthItem).appendChild(serialNumberOnTable);

    var itemNameOnTable = document.createElement('TD');
    itemNameOnTable.innerHTML = getNthItemNameOnTable(tableNumber, NthItem);
    document.getElementById('itemOnTable'+NthItem).appendChild(itemNameOnTable);

    var priceOfItemOnTable = document.createElement('TD');
    priceOfItemOnTable.innerHTML = getNthItemPriceOnTable(tableNumber, NthItem);
    document.getElementById('itemOnTable'+NthItem).appendChild(priceOfItemOnTable);

    var itemServingOnTable = document.createElement('INPUT');
    itemServingOnTable.type = "number";
    itemServingOnTable.min = "1";
    itemServingOnTable.value = getNthItemServingOnTable(tableNumber, NthItem);
    itemServingOnTable.id = "itemServing"+NthItem;
    itemServingOnTable.setAttribute('onchange', 'updateServing('+ tableNumber +','+ NthItem +')');

    var itemServingOnTableTD = document.createElement('TD');
    itemServingOnTableTD.appendChild(itemServingOnTable);
    document.getElementById('itemOnTable'+NthItem).appendChild(itemServingOnTable);

    var removeIcon = document.createElement('i');
    removeIcon.className = "material-icons";
    removeIcon.innerHTML = "delete";
    removeIcon.id = "remove"+NthItem;
    removeIcon.setAttribute("onclick",'removeItemOnTable('+tableNumber+','+NthItem+')');

    var removeIconTd = document.createElement('TD');
    removeIconTd.appendChild(removeIcon);
    document.getElementById('itemOnTable'+NthItem).appendChild(removeIconTd);
}

displayTableDetails = function(tableNumber) {
	document.getElementById('orderDetailsHeading').innerHTML = "Table "+tableNumber;
	document.getElementById('orderDetailsTable').innerHTML = "";
	addHeaderForOrderDetails();
	var totalBill = getTotalBillOfATable(tableNumber);
	var totalItems = getTotalNumberOfItemsOnTable(tableNumber);
	displayBillAndNumberOfItemsOnTable(tableNumber, totalBill, totalItems);

	for(var NthItem = 0; NthItem < tableOrders[tableNumber].length; NthItem++) {
		detailsOfItemsOnTable(tableNumber, NthItem);
	}

	document.getElementById('totalBillOfTable').innerHTML = "Total: "+totalBill;
	document.getElementById('orderDetailsDiv').style.display = 'block';
}

document.getElementById('closeOrderDetailsDiv').addEventListener('click', function(){
  document.getElementById('orderDetailsDiv').style.display = 'none';
}, false);
document.getElementById("generateBill").addEventListener('click', function(){
	removeAllItemsOnTable(tableClicked);
	document.getElementById('orderDetailsDiv').style.display = 'none';
}, false);

tablesOfDiv = document.getElementById("tablesDiv").getElementsByTagName('div');
for(var i=0 ; i<tablesOfDiv.length; i++) {
  tablesOfDiv[i].addEventListener('click', function(event){
    tableClicked = event.target.id;
    displayTableDetails(event.target.id);
  },false);
}

var items = JSON.parse('{"items":[{"id":"1","name":"Veg biryani","rate":"210","course":"main veg"},{"id":"2","name":"Paneer biryani","rate":"250","course":"main veg"},{"id":"3","name":"Paneer butter masala","rate":"150","course":"main curry"},{"id":"4","name":"Chicken biryani","rate":"250","course":"main nonveg"},{"id":"5","name":"Mutton biryani","rate":"300","course":"main nonveg"},{"id":"6","name":"Papad","rate":"50","course":"starter"},{"id":"7","name":"Shahi tukda","rate":"80","course":"sweet desert"}]}');

function searchItem() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("searchItemBox");
    filter = input.value.toUpperCase();
    ul = document.getElementById("listOfItems");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
searchTable = function() {
  var input = document.getElementById('searchTableBox').value.toUpperCase();
  for(var i=1; i<=numberOfTables; i++) {
    if(document.getElementById(i).innerHTML.toUpperCase().indexOf(input) > -1) {
      document.getElementById(i).style.display = "";
    } else {
      document.getElementById(i).style.display = "none";
    }
  }
}

items.items.forEach(function(obj) {
  var li = document.createElement('LI');
  li.id = obj.id;
  li.draggable = true;
  li.innerHTML = obj.name + '<br>' + obj.rate + '<br>' + '<span class="course">'+obj.course + '</span>';
  document.getElementById('listOfItems').appendChild(li);
});

window.onclick = function(event) {
  if (event.target == document.getElementById('orderDetailsDiv')) {
    document.getElementById('orderDetailsDiv').style.display = "none";
  }
}