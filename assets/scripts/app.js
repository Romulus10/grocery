// Application logic for Romulus10's Grocery Tracker
// This application is licensed under the GNU General-Purpose License

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

onload = function () {
    lib = new localStorageDB("groceries", localStorage);
    if (lib.isNew()) {
        lib.createTable("groceries", ["item", "price", "location", "date"]);
        lib.commit();
    }
    check_database(lib)
}

new_block = function (item_v, number_v, price_v, location_v, date_v) {
    var unit_price = price_v/number_v;
    lib.insert("groceries", {
        item: item_v,
        price: unit_price,
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
        string += ("<tr><th>{0}</th><th>${1}</th><th>{2}</th><th>{3}</th></tr>").supplant([full[i].item, full[i].price, full[i].location, full[i].date]);
    }
    string = string + "</table>";
    console.log(string);
    document.getElementById("list").innerHTML = string;
}

update_screen = function () {
    console.log("Submitted.");
    form_contents = get_form();
    new_block(form_contents[0], form_contents[1], form_contents[2], form_contents[3], form_contents[4]);
    check_database();
}

get_form = function () {
    var form_m = document.forms[0];
    var item = form_m.elements[0].value
    var number = form_m.elements[1].value
    var price = form_m.elements[2].value
    var location = form_m.elements[3].value
    var date = form_m.elements[4].value
    var return_val = Array(item, number, price, location, date);
    console.log(return_val);
    form_m.submit();
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
        if (results[i].price < min){
            min = results[i].price;
            loc = results[i].location;
            whe = results[i].date;
        }
    }
    alert("The lowest price for this item was ${0} at {1} on {2}".supplant([min, loc, whe]));
}