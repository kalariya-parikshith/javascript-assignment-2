var numberOfTables = 5;
var tablesArray;
var tableClicked;

createArrayForTables = function() {
	tablesArray = new Array();
	for(var i=0; i<=numberOfTables; i++) {
		tablesArray.push(new Array());
	}
}
createArrayForTables();

createTables = function() {
	for(var i=1; i<=numberOfTables; i++) {
		var div = document.createElement('DIV');
		div.className = "table";
		div.id = i;
		div.innerHTML = "Table "+ (i) + "<br>Rs. 0 | Total items: 0";
		document.getElementById('tablesDiv').appendChild(div);
	}
}
createTables();

getItemName = function(itemId) {
	var itemName;
	items[0].items.forEach(function(obj) {
		if(parseInt(obj.id) == parseInt(itemId)) {
			itemName = obj.name;
		}
	});
	return itemName;
}

getItemPrice = function(itemId) {
	var itemPrice;
	items[0].items.forEach(function(obj) {
		if(parseInt(obj.id) == parseInt(itemId)) {
			itemPrice = obj.rate;
		}
	});
	return parseInt(itemPrice);
}

getNthItemIdOnTable = function(tableNumber, NthItem) {
	var itemId = tablesArray[tableNumber][NthItem].split(",")[0];
	return parseInt(itemId);
}

getNthItemNameOnTable = function(tableNumber, NthItem) {
	
}

getNthItemServingOnTable = function(tableNumber, NthItem) {
	var noOfServings = tablesArray[tableNumber][NthItem].split(",")[1];
	return parseInt(noOfServings);
}

isItemPresentOnTable = function(tableNumber, itemId) {
	for(var NthItem = 0; NthItem < tablesArray[tableNumber].length; NthItem++) {
		if(getNthItemIdOnTable(tableNumber, NthItem) == parseInt(itemId)) {
			return true;
		}
	}
	return false;
}

incrementItemServingOnTable = function(tableNumber, itemId) {
	for(var NthItem = 0; NthItem < tablesArray[tableNumber].length; NthItem++) {
		if(getNthItemIdOnTable(tableNumber, NthItem) == parseInt(itemId)) {
			var noOfServings = getNthItemServingOnTable(tableNumber, NthItem);
			noOfServings++;
			tablesArray[tableNumber][NthItem] = itemId +","+ noOfServings;
		}
	}
}

document.addEventListener("dragstart", function(event) {
	event.dataTransfer.setData("itemId",event.target.id);
	console.log(event.target.id);
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
		tablesArray[parseInt(tableNumber)].push(itemId+","+"1");
	}

	var totalBill = 0;
	var totalItems = tablesArray[tableNumber].length;
	for(var NthItem=0; NthItem<tablesArray[tableNumber].length; NthItem++){
		totalBill += getItemPrice(tableNumber, NthItem)*getNthItemServingOnTable(tableNumber, NthItem);
	}
	document.getElementById(i).innerHTML = "Table "+ (i) + "<br>Rs. "+totalBill+" | Total items: "+totalItems;
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

displayTableDetails = function(tableNumber) {
  document.getElementById('orderDetailsHeading').innerHTML = "Table "+tableNumber;
  document.getElementById('orderDetailsTable').innerHTML = "";
  addHeaderForOrderDetails();
  var totalBill = 0;
  for(var NthItem = 0; NthItem < tablesArray[tableNumber].length; NthItem++){
    var itemDetailsOnTable = document.createElement('TR');
    itemDetailsOnTable.id = "itemOnTable"+i;
    document.getElementById('orderDetailsTable').appendChild(itemDetailsOnTable);

    var serialNumberOnTable = document.createElement('TD');
    serialNumberOnTable.innerHTML = i+1;
    document.getElementById('itemOnTable'+i).appendChild(serialNumberOnTable);

    var itemNameOnTable = document.createElement('TD');
    itemNameOnTable.innerHTML = getItemName(tableNumber, NthItem);
    document.getElementById('itemontable'+i).appendChild(itemNameOnTable);

    var newTdpriceOfItem = document.createElement('TD');
    newTdpriceOfItem.innerHTML = tablesArray[tableNumber][i].split(",")[2];
    document.getElementById('itemontable'+i).appendChild(newTdpriceOfItem);

    var newTdquantity = document.createElement('TD');
    newTdquantity.innerHTML = tablesArray[tableNumber][i].split(",")[3];
    document.getElementById('itemontable'+i).appendChild(newTdquantity);

    var removeIcon = document.createElement('i');
    removeIcon.className = "material-icons";
    removeIcon.innerHTML = "delete";

    var removeIconTd = document.createElement('TD');
    removeIcon.id = "remove"+i;
    removeIconTd.appendChild(removeIcon);
    document.getElementById('itemontable'+i).appendChild(removeIconTd);

    totalBill += parseInt(tablesArray[tableNumber][i].split(",")[2])*parseInt(tablesArray[tableNumber][i].split(",")[3]);

  }
  document.getElementById('totalBillOfTable').innerHTML = "Total: "+totalBill;
  document.getElementById('orderDetailsDiv').style.display = 'block';
}

document.getElementById('closeOrderDetailsDiv').addEventListener('click', function(){
  document.getElementById('orderDetailsDiv').style.display = 'none';
});

tablesOfDiv = document.getElementById("tablesDiv").getElementsByTagName('div');
for(var i=0 ; i<tablesOfDiv.length; i++) {
  tablesOfDiv[i].addEventListener('click', function(event){
    tableClicked = event.target.id;
    displayTableDetails(event.target.id);
  },false);
}

removeItemFromTheTable = function(itemId) {
  for(var i=0; i<tablesArray[tableClicked].length; i++) {
    if(parseInt(tablesArray[tableClicked][i].split(",")[0] == parseInt(itemId))) {
      tablesArray[tableClicked][i].splice(i,1);
      return;
    }
  }
}

orderDetailsOnPopup1 = document.getElementById("orderDetailsTable").childNodes;
for(var i=0; i<orderDetailsOnPopup1.length; i++) {
  console.log(orderDetailsOnPopup1[i].id);
  // orderDetailsOnPopup1[i].addEventListener('click', function(event){

    // removeItemFromTheTable(event.target.id);
    // console.log(tablesArray);
    // displayTableDetails(tableClicked);
  // },false);
}


var items = JSON.parse('[{"items":[{"id":"1","name":"Veg biryani","rate":"210","course":"main veg"},{"id":"2","name":"Paneer biryani","rate":"250","course":"main veg"},{"id":"3","name":"Paneer butter masala","rate":"150","course":"main curry"},{"id":"4","name":"Chicken biryani","rate":"250","course":"main nonveg"},{"id":"5","name":"Mutton biryani","rate":"300","course":"main nonveg"},{"id":"6","name":"Papad","rate":"50","course":"starter"},{"id":"7","name":"Shahi tukda","rate":"80","course":"sweet desert"}]}]');

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

items[0].items.forEach(function(obj) {
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