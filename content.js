chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === 'printHTML') {


        var nextButton = document.querySelector('[title="Next page"]');
        // while nextButton aria-disabled is false
        // click on the next button
        while (nextButton.getAttribute('aria-disabled') === 'false') {
            nextButton.click();
            // wait for the page to load
            await new Promise(r => setTimeout(r, 2000));
            // get all elements with data-test 'PropertyListCard-wrapper'
            var propertyListCards = document.querySelectorAll('[data-test="PropertyListCard-wrapper"]');
            // for each element, print the childNodes
            propertyListCards.forEach(function (propertyListCard) {
                // first node has nothing
                // second node has the price, bed/bath, sqft, address
                // third node has the property description
                
                // print the price (class=list-card-price), bed (class=list-card-details), bath (), sqft, address
                var propertyInfo = propertyListCard.childNodes[1];
                var price = propertyInfo.querySelector('.list-card-price').innerText;
                var details = propertyInfo.querySelector('.list-card-details');
                var bed = details.childNodes[0].innerText;
                var bath = details.childNodes[1].innerText;
                var sqft = details.childNodes[2].innerText;

                console.log(price);
                console.log(bed);
                console.log(bath);
                console.log(sqft);
            });
            nextButton = document.querySelector('[title="Next page"]');
        }
    }
});
