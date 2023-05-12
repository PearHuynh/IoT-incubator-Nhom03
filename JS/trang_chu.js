let images = [
    "image/trung1.jpg",
    "image/trung2.jpg",
    "image/trung3.jpg"];
let currentIndex = 0;

setInterval(() => {
    currentIndex = (currentIndex + 1 + images.length) % images.length;
    let displayedImage = document.getElementById("displayed-image");
    displayedImage.style.transform = "translateX(50%)";
    displayedImage.style.opacity = "0";
    setTimeout(() => {
      displayedImage.src = images[currentIndex];
      displayedImage.style.transform = "translateX(0%)";
      displayedImage.style.opacity = "1";
    }, 500);
}, 5000);

document.getElementById("prev-button").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    let displayedImage = document.getElementById("displayed-image");
    displayedImage.style.transform = "translateX(-50%)";
    displayedImage.style.opacity = "0";
    setTimeout(() => {
      displayedImage.src = images[currentIndex];
      displayedImage.style.transform = "translateX(0%)";
      displayedImage.style.opacity = "1";
    }, 500);
  });
  
  document.getElementById("next-button").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    let displayedImage = document.getElementById("displayed-image");
    displayedImage.style.transform = "translateX(50%)";
    displayedImage.style.opacity = "0";
    setTimeout(() => {
      displayedImage.src = images[currentIndex];
      displayedImage.style.transform = "translateX(0%)";
      displayedImage.style.opacity = "1";
    }, 500);
  });