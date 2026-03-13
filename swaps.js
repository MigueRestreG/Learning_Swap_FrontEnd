// Select all carousels on the page
const carousels = document.querySelectorAll(".card-wrapper");

// Loop through each carousel
carousels.forEach((carousel) => {

let position = 0; // current position of the carousel
const cardWidth = 324; // width of each card including the gap
const totalCards = carousel.children.length; // total number of original cards


// Clone the original cards and append them to the end
// This creates the illusion of an infinite loop
for(let i = 0; i < totalCards; i++){
const clone = carousel.children[i].cloneNode(true);
carousel.appendChild(clone);
}


// Get navigation buttons for the current carousel
const prev = carousel.parentElement.parentElement.querySelector(".prev");
const next = carousel.parentElement.parentElement.querySelector(".next");


// NEXT BUTTON
next.addEventListener("click", () => {

position++; // move forward one card

// apply smooth animation
carousel.style.transition = "transform .4s ease";
carousel.style.transform = `translateX(-${position * cardWidth}px)`;


// If we reach the end of the original cards
// reset the position to the start without animation
if(position >= totalCards){

setTimeout(() => {

carousel.style.transition = "none"; // disable animation
position = 0; // reset position
carousel.style.transform = `translateX(0px)`; // jump back to start

},400)

}

});


// PREVIOUS BUTTON
prev.addEventListener("click", () => {

// If we are at the beginning
if(position <= 0){

// jump to the duplicated end instantly
carousel.style.transition = "none";
position = totalCards;
carousel.style.transform = `translateX(-${position * cardWidth}px)`;

// then animate back one card
setTimeout(()=>{
carousel.style.transition = "transform .4s ease";
position--;
carousel.style.transform = `translateX(-${position * cardWidth}px)`;
},10)

}else{

// normal backward movement
position--;
carousel.style.transform = `translateX(-${position * cardWidth}px)`;

}

});

});
