// npm init playwright -->create the playwright project
const {test, expect}=require('@playwright/test');
const {login} = require('../utils/auth')

//step-1
test.skip('My First Test Cases', async ({page})=>{
    
    await login(page);
})

//step-2
test.skip('New Event', async({page})=>{

    await login(page); 

    await page.goto('admin/events');

    //Event Title
    const title = "Green Olive Project"+Date.now();

    await page.getByPlaceholder("Event title").fill(title);

    await page.getByPlaceholder('Describe the event…').fill("This is a description");

    await page.locator('[id="city"]').fill("Pune");

    await page.locator('[id="venue"]').fill("Infosys Circle, Phase 1, Pune");

    await page.getByLabel("Event Date & Time").fill("2027-12-03T11:12");

    await page.locator('[id="price-($)"]').fill("100");

    await page.getByPlaceholder('e.g. 500').fill("50");

    await page.locator('[id="image-url-(optional)"]').fill("https://www.istockphoto.com/photos/sunflower");

    await page.waitForTimeout(2000);

    await page.locator("#add-event-btn").click();

    await page.waitForTimeout(1000);
})


//step-3

test.skip("Find the event card and capture seats", async({page})=>{

    await login(page);

    await page.locator('[id="nav-events"]').click();

    const eventCard = await page.locator('[data-testid="event-card"]').count();
    console.log("Event Card Count:", eventCard);

    await expect(page.locator("//div//a/h3[text()='Dilli Diwali Mela']")).toHaveText("Dilli Diwali Mela")

    const allCards = page.locator('#event-card div a h3');
    const EventsbyMe = ["Green Olive Project1779987634136", "This is a1779720156256", "This is a1779720145481"];

    // This checks if the page contains partially these headings
    await expect(allCards).toContainText(EventsbyMe);

    //check if the events created by you are visible on screen or not
    for(let eventName of EventsbyMe){
        const cardHeading = allCards.filter({hasText:eventName})

        await expect(cardHeading).toBeVisible();
    }

    const seatArray = [];

    //find seats available on the events created by you
    for(let eventName of EventsbyMe){
        const myCard = page.locator('#event-card div').filter({ has: page.locator('h3', { hasText: eventName }) });
  
        const seatsElement = myCard.locator('text=/seats available/');
  
        const seatsText = await seatsElement.textContent();

        seatArray.push(seatsText)
    }

    console.log("Seat Availbale", seatArray);

})

// step-4

test("Start Booking", async ({page, baseURL})=>{

    await login(page);
    await page.locator('[id="nav-events"]').click();

    //It will click Book Now button for Green Olive Project Only.
    const cardHeading = page.locator('[data-testid="event-card"]').filter({ has: page.locator('h3', {hasText: "Green Olive Project1779987634136"})});
    await cardHeading.getByRole('link', { name: 'Book Now'}).click();
    await page.waitForTimeout(2000);


    //step -5 Fill Booking Form
    await expect(page.locator('[id="ticket-count"]')).toHaveText("1")

    //fill username
    await page.getByLabel('Full Name').fill("Sohit patel");

    await page.locator('[id="customer-email"]').fill('Sohitpatel12@gmail.com');

    await page.getByPlaceholder('+91 98765 43210').fill('+91 8005003001');

    await page.waitForTimeout(2000);

    await page.locator('.confirm-booking-btn').click();

    //Step-6 Verify booking Confirmation
    const confirm = await page.locator('span .booking-ref').first()
    await expect(confirm).toBeVisible();

    const bookingRef = (await confirm.innerText()).trim();
    console.log("BookinfRef",bookingRef);

    //step-7 Verify in My Bookings
    await page.getByRole('link', {name: 'View My Bookings'}).click();
    await expect(page).toHaveURL(`${baseURL}bookings`)

    //getting All Booking Cards
    const bookingsCount = await page.locator('#booking-card');
    //Assert the first booking card is visible
    await expect(bookingsCount.first()).toBeVisible();

    //Filter booking cards for the one that contains an element with 
    // class .booking-ref matching your bookingRef text

    const bookingRefID = page.locator('[id="booking-card"]').filter({has: page.locator('.booking-ref', {hasText: bookingRef})});
    await expect(bookingRefID).toBeVisible();

    //Assert that matched card contains your eventTitle text
    await expect(bookingRefID.locator('h3')).toContainText("Green Olive Project");


    //step-8. Verify seat reduction
    

    
})
