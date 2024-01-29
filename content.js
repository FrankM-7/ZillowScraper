function cleanPrice(price) {
    if (price === "$--") price = "$0";
    if (price.includes('/mo')) price = price.split('/mo')[0];
    if (price.includes('+')) price = price.split('+')[0];
    if (price.includes(' ')) price = price.split(' ')[0];
    return price.replace(/,/g, '');
}

function cleanSqft(sqft) {
    if (sqft === "-- sqft") sqft = "0";
    if (sqft.includes(' ')) sqft = sqft.split(' ')[0];
    return sqft.replace(/,/g, '');
}

function cleanAddress(address) {
    address = address.split(',')[0];
    address = address.split('#')[0];
    address = address.split('APT')[0];
    address = address.split('UNIT')[0];
    address = address.split('SUITE')[0];
    address = address.split('FL')[0];
    address = address.split('FLOOR')[0];

    return address;
}

function getProperties() {
    var properties = [];
    //somthing
    // get all elements with data-test 'PropertyListCard-wrapper'
    var propertyListCards = document.getElementsByClassName('sc-fzoXzr');
    // turn HTMLCollection into array
    propertyListCards = Array.from(propertyListCards);
    // for each element, print the childNodes
    propertyListCards.forEach(function (propertyListCard) {
        try {  
            var property = {};
            var propertyInfo = propertyListCard.childNodes[1];
            var price = propertyInfo.querySelector('.list-card-price').innerText;
            var sqft = null;
            var bed = null;
            var bath = null;
            var address = propertyInfo.querySelector('.list-card-addr').innerText;
            var link = propertyInfo.querySelector('.list-card-link').href;
            // check if the property has data-test="PropertyListCard-wrapper"'
            if (propertyListCard.getAttribute('data-test') !== 'PropertyListCard-wrapper') {
                var price2 = propertyInfo.querySelector('.list-card-details').innerText;

                // split address by '|'
                address = address.split('|');
                var name = address[0];
                address = address[1].trim();

                // get the sqft title="Floorplans" sibling
                sqft = propertyListCard.childNodes[2].querySelector('[title="Floorplans"]').nextSibling.innerText;
                var sqftHigh = sqft.split(',')[1].split('-')[1];
                sqft = sqft.split(',')[1].split('-')[0].trim();
                // keep only the number
                sqftHigh = sqftHigh.replace(/\D/g, '');
                sqft = sqft.replace(/\D/g, '');
                
                bed = price.split(' ')[1];
                bath = bed;
                // console.log(price);
                // console.log(price2);
                // console.log(name);
                // console.log(address);
                // console.log(sqft);
                // console.log(sqftHigh);
            } else {
                var details = propertyInfo.querySelector('.list-card-details');
                bed = details.childNodes[0].innerText.split(' ')[0];
                bath = details.childNodes[1].innerText.split(' ')[0];
                sqft = details.childNodes[2].innerText;
            }
            // format price
            price = cleanPrice(price);
            sqft = cleanSqft(sqft);
            address = cleanAddress(address);
            property.price = price;
            property.sqft = sqft;
            property.bed = bed;
            property.bath = bath;
            property.address = address;
            property.link = link;
            properties.push(property);

        } catch (error) {
            console.log("Listing is not a property anymore");
        }
    });

    return properties;

}


chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === 'printHTML') {
        var nextButton = document.querySelector('[title="Next page"]');
        var properties = [];
        // while nextButton aria-disabled is false
        do {
            properties = properties.concat(getProperties());
            nextButton = document.querySelector('[title="Next page"]');
            nextButton.click();
            // wait for the page to load
            await new Promise(r => setTimeout(r, 2000));
        } while (nextButton.getAttribute('aria-disabled') === 'false');
        properties = properties.concat(getProperties());
        console.log(properties);
        
        // export to csv
        var csv = 'address, price, sqft, bed, bath, link,\n';
        properties.forEach(function (property) {
            csv += property.address + ',' + property.price + ',' + property.sqft + ',' + property.bed + ',' + property.bath + ',' + property.link + '\n';
        });
        var encodedUri = encodeURI(csv);
        var link = document.createElement("a");
        link.setAttribute("href", "data:text/csv;charset=utf-8," + encodedUri);
        link.setAttribute("download", "properties.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        link.remove();

    }
});
