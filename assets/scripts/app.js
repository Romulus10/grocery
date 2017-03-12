// Application logic for Romulus10's Grocery Tracker
// This application is licensed under the GNU General-Purpose License

var total; // I'm sorry
var lib; // I'm so sorry


String.prototype.supplant = function (o) {
    // From Douglas Crockford's Remedial JavaScript
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

database_sort = function(array) {
    var tmp;
    var swapped = false;
    var n = array.length;
    while (swapped) {
        console.log("Sorting...");
        swapped = false;
        for (var i = 0; i < n-1; i++) {
            console.log("i = " + i + "/" + n-1);
            if (array[i-1].item > array[i].item) {
                console.log("Swapping.");
                tmp = array[i-1];
                array[i-1] = array[i];
                array[i] = tmp;
                swapped = true;
            }
        }
    }
    return array;
}

onload = function () {
    total = 0;
    lib = new localStorageDB("groceries", localStorage);
    if (lib.isNew()) {
        lib.createTable("groceries", ["item", "price", "unit", "location", "date"]);
        lib.createTable("items", ["item"]);
        lib.createTable("locations", ["name"]);
        lib.commit();
    }
    check_database();
    check_item();
    check_location();
}

new_block = function (item_v, number_v, price_v, unit_v, location_v, date_v) {
    var unit_price = Math.round(((price_v / number_v) * 100)) / 100;
    lib.insert("groceries", {
        item: item_v,
        price: unit_price,
        unit: unit_v,
        location: location_v,
        date: date_v
    });
    lib.commit();
    compare(item_v);
}

check_database = function () {
    var full = lib.queryAll("groceries");
    console.log(full);
    var len = full.length;
    var string = "<table><tr><th>Compare</th><th>Item</th><th>Unit Price</th><th>Location</th><th>Date</th></tr>"
    console.log("Number of database indices- " + len);
    for (var i = 0; i < len; i++) {
        console.log(full[i]);
        string += ("<tr><th><button onclick=\"compare(\'{0}\')\">Compare</button></th><th>{0}</th><th>${1}/{4}</th><th>{2}</th><th>{3}</th></tr>").supplant([full[i].item, full[i].price, full[i].location, full[i].date, full[i].unit]);
    }
    string = string + "</table>";
    console.log(string);
    document.getElementById("list").innerHTML = string;
}

check_item = function() {
    var full = lib.queryAll("items");
    console.log(full);
    var len = full.length;
    var check = full;
    full = database_sort(full);
    console.log(full);
    if (full == full) {
        console.log("Test failed.");
    }
    var string = "<select>"
    console.log("Number of database indices- " + len);
    for (var i = 0; i < len; i++) {
        console.log(full[i]);
        string += ("<option value='{0}'>{0}</option>").supplant([full[i].item]);
    }
    string += "</select>"
    console.log(string);
    document.getElementById("item").innerHTML = string;
}

check_location = function() {
    var full = lib.queryAll("locations");
    console.log(full);
    var len = full.length;
    var string = "<select>"
    console.log("Number of database indices- " + len);
    for (var i = 0; i < len; i++) {
        console.log(full[i]);
        string += ("<option value='{0}'>{0}</option>").supplant([full[i].name]);
    }
    string += "</select>"
    console.log(string);
    document.getElementById("location").innerHTML = string;
}

update_screen = function () {
    console.log("Submitted.");
    form_contents = get_form();
    new_block(form_contents[0], form_contents[1], form_contents[2], form_contents[3], form_contents[4], form_contents[5]);
    check_database();
    check_item();
    check_location();
}

get_form = function () {
    var good = true;
    var form_m = document.forms[0];
    for (var x = 0; x < 5; x++) {
        if (form_m.elements[x].value = "") {
            good = false;
        }
    }
    if (good) {
        var item = form_m.elements[0].value;
        var number = form_m.elements[1].value;
        var type = form_m.elements[2].value;
        var price = form_m.elements[3].value;
        var location = form_m.elements[4].value;
        var date = form_m.elements[5].value;
        total += parseFloat(price);
        document.getElementById('display').innerHTML = '$' + total;
        var return_val = Array(item, number, price, type, location, date);
        console.log(return_val);
        for (var x = 0; x < 5; x++) {
            form_m.elements[x].value = "";
        }
        return return_val;
    } else {
        alert("Be sure to fill out the entire form.");
    }
}

compare = function (name_v) {
    var results = lib.queryAll("groceries", {
        query: {
            item: name_v
        }
    });
    var min = 999999999;
    var loc = "";
    var whe = "";
    for (var i = 0; i < results.length; i++) {
        if (results[i].price < min) {
            min = results[i].price;
            loc = results[i].location;
            whe = results[i].date;
        }
    }
    alert("The lowest price for this item was ${0} at {1} on {2}".supplant([min, loc, whe]));
}

clear_total = function(){
    document.getElementById('display').innerHTML = '$0.00';
    total = 0;
}

new_item = function() {
    var name = prompt("Item Name");
    lib.insert("items", {
        item: name
    });
    lib.commit();
    check_item();
}

new_location = function() {
    var name_v = prompt("Store Name");
    lib.insert("locations", {
        name: name_v
    });
    lib.commit();
    check_location();
}
