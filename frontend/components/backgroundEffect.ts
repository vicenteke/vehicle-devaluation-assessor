import * as Matter from 'matter-js';

export function createBackground() {
    // Constants
    const BALL_RADIUS = 20;
    const BALL_COUNT = 70;
    const MOUSE_RADIUS = 70;
    const BALL_COLOR = '#E2E8F0';
    const MOUSE_EVENT = 'mousemove';
    const MIN_SPEED = 5; // Minimum speed (pixels per frame)
    const INITIAL_SPEED = 10; // Initial speed (pixels per frame)
    const HTML_CANVAS_ID = 'background-canvas';

    // Setup canvas
    const canvas = document.getElementById(HTML_CANVAS_ID) as HTMLCanvasElement;
    const context = canvas.getContext('2d')!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matter.js engine
    const engine = Matter.Engine.create();
    const world = engine.world;

    // Disable gravity
    world.gravity.y = 0; // Set gravity to zero (no gravity)

    // Walls for boundaries
    const walls = [
        Matter.Bodies.rectangle(canvas.width / 2, 0, canvas.width, 1, { isStatic: true }), // Top
        Matter.Bodies.rectangle(canvas.width / 2, canvas.height, canvas.width, 1, { isStatic: true }), // Bottom
        Matter.Bodies.rectangle(0, canvas.height / 2, 1, canvas.height, { isStatic: true }), // Left
        Matter.Bodies.rectangle(canvas.width, canvas.height / 2, 1, canvas.height, { isStatic: true }) // Right
    ];
    Matter.World.add(world, walls);

    // Create balls
    const balls: Matter.Body[] = [];
    for (let i = 0; i < BALL_COUNT; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const ball = Matter.Bodies.circle(x, y, BALL_RADIUS, {
            friction: 0.5,
            restitution: 0.8,
            density: 0.04,
        });

        // Set initial velocity (random direction)
        Matter.Body.setVelocity(ball, {
            x: Math.random() * 2 * INITIAL_SPEED - INITIAL_SPEED,
            y: Math.random() * 2 * INITIAL_SPEED - INITIAL_SPEED
        });

        Matter.World.add(world, ball);
        balls.push(ball);
    }

    // Mouse interaction
    canvas.addEventListener(MOUSE_EVENT, (event) => {
        const cursorPosition = {
            x: event.clientX,
            y: event.clientY
        };

        for (const ball of balls) {
            const dx = cursorPosition.x - ball.position.x;
            const dy = cursorPosition.y - ball.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if the ball is within the "invisible circle" around the cursor
            if (distance < BALL_RADIUS + MOUSE_RADIUS) {
                // Calculate reflection angle off the "invisible circle"
                const angle = Math.atan2(dy, dx);
                const reflectionAngle = angle + Math.PI; // Reflect by 180 degrees

                // Apply velocity change to bounce off the "invisible circle"
                Matter.Body.setVelocity(ball, {
                    x: Math.cos(reflectionAngle) * INITIAL_SPEED,
                    y: Math.sin(reflectionAngle) * INITIAL_SPEED
                });
            }

            // Ensure minimum speed (prevent stopping)
            const speed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
            if (speed < MIN_SPEED) {
                // Increase speed to minimum threshold
                const scaleFactor = MIN_SPEED / speed;
                Matter.Body.setVelocity(ball, {
                    x: ball.velocity.x * scaleFactor,
                    y: ball.velocity.y * scaleFactor
                });
            }
        }
    });

    // Render loop
    function render() {
        Matter.Engine.update(engine);

        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const ball of balls) {
            const position = ball.position;
            const radius = ball.circleRadius!;

            context.beginPath();
            context.arc(position.x, position.y, radius, 0, 2 * Math.PI);
            context.fillStyle = BALL_COLOR;
            context.fill();
            context.closePath();

            // Ensure minimum speed (prevent stopping)
            const speed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
            if (speed < MIN_SPEED) {
                // Increase speed to minimum threshold
                const scaleFactor = MIN_SPEED / speed;
                Matter.Body.setVelocity(ball, {
                    x: ball.velocity.x * scaleFactor,
                    y: ball.velocity.y * scaleFactor
                });
            }
        }

        requestAnimationFrame(render);
    }

    render();
}
