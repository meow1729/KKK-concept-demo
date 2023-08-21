// Character class (double trouble)
class Character {
  constructor(x, y, c, upKey, downKey, leftKey, rightKey) {
    this.position = createVector(x, y);
    this.color = c;
    this.speed = 3;
    this.upKey = upKey;
    this.downKey = downKey;
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.trail = [];
    this.trailLength = 66;  // You can adjust this for a longer or shorter trail.
  }

  update(opponentTrail) {
    if (keyIsDown(this.upKey) && !this.collision(0, -this.speed, opponentTrail)) {
      this.position.y -= this.speed;
    }
    if (keyIsDown(this.downKey) && !this.collision(0, this.speed, opponentTrail)) {
      this.position.y += this.speed;
    }
    if (keyIsDown(this.leftKey) && !this.collision(-this.speed, 0, opponentTrail)) {
      this.position.x -= this.speed;
    }
    if (keyIsDown(this.rightKey) && !this.collision(this.speed, 0, opponentTrail)) {
      this.position.x += this.speed;
    }

    // Boundary checking
    this.position.x = constrain(this.position.x, 0, width);
    this.position.y = constrain(this.position.y, 0, height);

    // Handle the trail
    this.trail.push(this.position.copy());
    while (this.trail.length > this.trailLength) {
      this.trail.shift();
    }
  }

  show() {
    fill(this.color);
    rect(this.position.x, this.position.y, 20, 20);
  }

  showTrail() {
    for (let i = 0; i < this.trail.length; i++) {
      let pos = this.trail[i];
      fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], map(i, 0, this.trailLength, 0, 255));
      rect(pos.x, pos.y, 20, 20);
    }
  }

  eat(target) {
    let d = dist(this.position.x, this.position.y, target.x, target.y);
    return d < 20;
  }

  collision(dx, dy, opponentTrail) {
    let newPos = createVector(this.position.x + dx, this.position.y + dy);
    for (let pos of opponentTrail) {
      if (newPos.dist(pos) < 20) return true;
    }
    return false;
  }
}

let char1A, char1B, char2A, char2B;
let cookies = [];
let cookieSize = 20;
let score1 = 0;
let score2 = 0;

function setup() {
  createCanvas(600, 400);
  char1A = new Character(75, height / 3, color(100, 150, 255), 87, 83, 65, 68);  // W, S, A, D 
  char1B = new Character(75, 2 * height / 3, color(100, 150, 255), UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW);
  char2A = new Character(525, height / 3, color(255, 150, 100), 104, 101, 100, 102);  // 8, 5, 4, 6 on numpad
  char2B = new Character(525, 2 * height / 3, color(255, 150, 100), 73, 75, 74, 76);  // I, K, J, L
  for (let i = 0; i < 2; i++) {
    spawnCookie();
  }

}

function draw() {
  background(220);

  char1A.update([...char2A.trail, ...char2B.trail]);
  char1B.update([...char2A.trail, ...char2B.trail]);
  char2A.update([...char1A.trail, ...char1B.trail]);
  char2B.update([...char1A.trail, ...char1B.trail]);

  char1A.show();
  char1B.show();
  char2A.show();
  char2B.show();
  
  char1A.showTrail();
  char1B.showTrail();
  char2A.showTrail();
  char2B.showTrail();

  
  textSize(20);
  fill(0);
  text(`Player 1 Score: ${score1}`, 10, 30);
  text(`Player 2 Score: ${score2}`, width - 190, 30);
  
  for (let c of cookies) {
    fill(50, 255, 50);
    ellipse(c.x, c.y, cookieSize);
  }

  for (let i = cookies.length - 1; i >= 0; i--) {
    if (char1A.eat(cookies[i]) || char1B.eat(cookies[i]) || char2A.eat(cookies[i]) || char2B.eat(cookies[i])) {
      if (char1A.eat(cookies[i]) || char1B.eat(cookies[i])) {
        score1++;
      } else {
        score2++;
      }
      cookies.splice(i, 1);
      spawnCookie();
    }
  }

}

function spawnCookie() {
  let x = random(cookieSize / 2, width - cookieSize / 2);
  let y = random(cookieSize / 2, height - cookieSize / 2);
  cookies.push(createVector(x, y));
}
