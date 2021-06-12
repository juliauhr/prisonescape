var Example = Example || {};

Example.chains = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            showAngleIndicator: true,
            showCollisions: true,
            showVelocity: true
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies

    var block1 = Bodies.rectangle(150, 400, 100, 100, { isStatic: true });
    var block2 = Bodies.rectangle(0, 300, 150, 150, { isStatic: true });

    group = Body.nextGroup(true);

    var linkCount = 15;
    var linkHeight = 20;
    var linkWidth = 30;

    var ropeC = Composites.stack(300, 50, linkCount, 1, 10, 10, function(x, y) {
        return Bodies.rectangle(x - 20, y, linkWidth, linkHeight, { collisionFilter: { group: group }, chamfer: 5 });
    });

    Body.setDensity(ropeC.bodies[0],10);
    Body.scale(ropeC.bodies[0],2,3);

    Body.setDensity(ropeC.bodies[linkCount-1], 0.01);
    Body.scale(ropeC.bodies[linkCount-1], 2, 3);
    //Body.frictionStatic(ropeC.bodies[0], .8);

    Composites.chain(ropeC, 0.3, 0, -0.3, 0, { stiffness: 1, length: 0 });

    /*Composite.add(ropeC, Constraint.create({
        bodyB: ropeC.bodies[0],
        pointB: { x: -20, y: 0 },
        pointA: { x: ropeC.bodies[0].position.x, y: ropeC.bodies[0].position.y },
        stiffness: 0.5
    }));*/

    Composite.add(world, [
        ropeC,
        block1,
        block2,
        Bodies.rectangle(400, 500, 1200, 50.5, { isStatic: true })
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 1,
                render: {
                    visible: true
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 700, y: 600 }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};

Example.chains();
