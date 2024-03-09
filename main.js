const FAN_SPEED = 2;

const textElem = document.getElementById("text");
const keyElems = document.getElementsByClassName("key");
const fanElem = document.getElementById("fan");
const cursorElem = document.getElementById("cursor");
const fanPos = { x: 50, y: 50 };
const cursorPos = { x: 200, y: 112 };
const cursorVel = { x: 0, y: 0 };
let isFanClicked = false;

fanElem.addEventListener("dragstart", (e) => e.preventDefault());
fanElem.addEventListener("mousedown", () => (isFanClicked = true));
fanElem.addEventListener("mouseup", () => (isFanClicked = false));
document.addEventListener("mouseleave", () => (isFanClicked = false));

document.addEventListener("mousemove", (e) => {
  if (!isFanClicked) return;
  fanPos.x = e.pageX - fanElem.clientWidth / 2;
  fanPos.y = e.pageY - fanElem.clientHeight / 2;
  if (fanPos.x < -fanElem.clientWidth / 2) {
    fanPos.x = -fanElem.clientWidth / 2;
  } else if (fanPos.x > document.body.clientWidth - fanElem.clientWidth / 2) {
    fanPos.x = document.body.clientWidth - fanElem.clientWidth / 2;
  }
  if (fanPos.y < -fanElem.clientHeight / 2) {
    fanPos.y = -fanElem.clientHeight / 2;
  } else if (fanPos.y > document.body.clientHeight - fanElem.clientHeight / 2) {
    fanPos.y = document.body.clientHeight - fanElem.clientHeight / 2;
  }
});

function blowCursor(deltaTime) {
  // direction from the fan to the fan cursor
  const direction = {
    x:
      cursorPos.x +
      cursorElem.clientWidth / 2 -
      (fanPos.x + fanElem.clientWidth / 2),
    y:
      cursorPos.y +
      cursorElem.clientHeight / 2 -
      (fanPos.y + fanElem.clientHeight / 2),
  };
  // distance between the fan and the fan cursor
  const distance = Math.sqrt(
    Math.pow(direction.x, 2) + Math.pow(direction.y, 2)
  );
  // make the direction a unit vector
  direction.x /= distance;
  direction.y /= distance;
  // calculate the force and apply it
  const force = Math.pow(FAN_SPEED / 10, 2) / distance;
  cursorVel.x += force * direction.x * deltaTime;
  cursorVel.y += force * direction.y * deltaTime;
}

function decelerateCursor(deltaTime) {
  // apply the viscous friction formula
  const accX = (0.1 * Math.pow(cursorVel.x, 2)) / 2;
  const accY = (0.1 * Math.pow(cursorVel.y, 2)) / 2;
  if (Math.round(cursorVel.x * 1000) == 0) {
    cursorVel.x = 0;
  } else {
    cursorVel.x += accX * (cursorVel.x > 0 ? -1 : 1);
  }
  if (Math.round(cursorVel.y * 1000) == 0) {
    cursorVel.y = 0;
  } else {
    cursorVel.y += accY * (cursorVel.y > 0 ? -1 : 1);
  }
}

function updateFan() {
  // update fan position
  fanElem.style.left = `${fanPos.x}px`;
  fanElem.style.top = `${fanPos.y}px`;
  // update fan rotation
  const diffX =
    cursorPos.x +
    cursorElem.clientWidth / 2 -
    (fanPos.x + fanElem.clientWidth / 2);
  const diffY =
    cursorPos.y +
    cursorElem.clientHeight / 2 -
    (fanPos.y + fanElem.clientHeight / 2);
  let rotation = (Math.atan(diffY / diffX) * 180) / Math.PI;
  if (diffX < 0) rotation += 180;
  if (diffY < 0) rotation += 360;
  fanElem.style.transform = `rotate(${rotation}deg)`;
}

function updateCursor(deltaTime) {
  cursorPos.x += cursorVel.x * deltaTime;
  cursorPos.y += cursorVel.y * deltaTime;
  if (cursorPos.x < 0) {
    cursorPos.x = 0;
  } else if (cursorPos.x > document.body.clientWidth - cursorElem.clientWidth) {
    cursorPos.x = document.body.clientWidth - cursorElem.clientWidth;
  }
  if (cursorPos.y < 0) {
    cursorPos.y = 0;
  } else if (
    cursorPos.y >
    document.body.clientHeight - cursorElem.clientHeight
  ) {
    cursorPos.y = document.body.clientHeight - cursorElem.clientHeight;
  }
  cursorElem.style.left = `${cursorPos.x}px`;
  cursorElem.style.top = `${cursorPos.y}px`;
}

function isCollision(rect1, rect2) {
  return (
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top &&
    rect1.left < rect2.right &&
    rect1.right > rect2.left
  );
}
let warningCount = 0;

function displayWarningMessage() {
  const warningMessages = [
    "Warning: Are you sure?",
    "You are making wrong choices!",
    "This is not the way to heaven on Earth, my angel!",
    "I really do love you so!",
    "I love you so!", 
    "I love you",
    "I luv you",
    "ILU"
  ];

  // Create a warning message element
  const warningMessage = document.createElement("div");
  warningMessage.textContent = warningMessages[warningCount];
  warningMessage.style.position = "absolute";
  warningMessage.style.top = "10px";
  warningMessage.style.left = "50%";
  warningMessage.style.transform = "translateX(-50%)";
  warningMessage.style.color = "yellow";

  // Append the warning message to the document body
  document.body.appendChild(warningMessage);

  // Increment the warning count
  warningCount = (warningCount + 1) % warningMessages.length;

  // Remove the warning message after a short delay
  setTimeout(() => {
    warningMessage.remove();
  }, 2000); // Adjust the delay as needed
}
let lastKey = null;
function handleCursorHover() {
  const elementsToShake = document.querySelectorAll('#opening, .key, #cursor, #fan');
  for (const key of keyElems) {
    if (
      isCollision(
        cursorElem.getBoundingClientRect(),
        key.getBoundingClientRect()
      )
    ) {
      if (key === lastKey) {
        return;
      }
      lastKey = key;
      if (key.id === "clear-btn") {
        textElem.innerText = "";
      }
      else if (key.id === "cf-btn") {
        if (textElem.innerText.includes("YES") && !textElem.innerText.includes("NO")) {
          document.body.style.backgroundColor = "black";
          window.location.href="./heart.html";
        } else {
          textElem.innerText = "";
          displayWarningMessage();
          for (const elem of elementsToShake) {
            if (elem != fanElem) {
                elem.style.animation = 'none';
                elem.offsetHeight; 
                elem.style.animation = 'shake-grow 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both, shake-left-right 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97)'; /* Concatenate both animations */
            }
          }
        }
      }

      else {
        textElem.innerText += key.dataset.key;
      }
      key.classList.add("hover");
      return;
    }
  }
  lastKey?.classList.remove("hover");
  lastKey = null;
}


let lastTime = null;
function update(time) {
  requestAnimationFrame(update);
  if (!lastTime) {
    lastTime = time;
    return;
  }
  const deltaTime = time - lastTime;
  lastTime = time;

  blowCursor(deltaTime);
  decelerateCursor(deltaTime);
  updateFan();
  updateCursor(deltaTime);
  handleCursorHover();
}

requestAnimationFrame(update);
