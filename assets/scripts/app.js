// Application logic for Romulus10's Grocery Tracker
// This application is licensed under the GNU General-Purpose License

var total; // I'm sorry
var lib; // I'm so sorry
var lib1; // Even more
var lib2; // ...no...why


String.prototype.supplant = function (o) {
    // From Douglas Crockford's Remedial JavaScript
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

onload = function () {
    total = 0;
    lib = new localStorageDB("groceries", localStorage);
    lib1 = new localStorageDB("items", localStorage);
    lib2 = new localStorageDB("locations", localStorage);
    if (lib.isNew()) {
        lib.createTable("groceries", ["item", "price", "unit", "location", "date"]);
        lib.commit();
    }
    if (lib1.isNew()) {
        lib1.createTable("items", ["item"]);
        lib1.commit();
    }
    if (lib2.isNew()) {
        lib2.createTable("locations", ["name"]);
        lib2.commit();
    }
    check_database();
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
    var string = "<table><tr><th>Item</th><th>Unit Price</th><th>Location</th><th>Date</th></tr>"
    console.log("Number of database indices- " + len);
    for (var i = 0; i < len; i++) {
        console.log(full[i]);
        string += ("<tr><th><button onclick='compare('{0}')'>Compare</button></th><th>{0}</th><th>${1}/{4}</th><th>{2}</th><th>{3}</th></tr>").supplant([full[i].item, full[i].price, full[i].location, full[i].date, full[i].unit]);
    }
    string = string + "</table>";
    console.log(string);
    document.getElementById("list").innerHTML = string;
}

update_screen = function () {
    console.log("Submitted.");
    form_contents = get_form();
    new_block(form_contents[0], form_contents[1], form_contents[2], form_contents[3], form_contents[4], form_contents[5]);
    check_database();
}

get_form = function () {
    var form_m = document.forms[0];
    var item = form_m.elements[0].value;
    var number = form_m.elements[1].value;
    var type = form_m.elements[2].value;
    var price = form_m.elements[3].value;
    var location = form_m.elements[4].value;
    var date = form_m.elements[5].value;
    total += parseInt(price);
    document.getElementById('display').innerHTML = '$' + total;
    var return_val = Array(item, number, price, type, location, date);
    console.log(return_val);
    for (var x = 0; x < 5; x++) {
        form_m.elements[x].value = "";
    }
    return return_val;
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
