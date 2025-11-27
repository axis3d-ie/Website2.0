    // Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        touchMultiplier: 2,
    })

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Three.js Scene Setup (V1 Geometry, V2 Colors/Performance)
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xFFFFFF, 0.05);
    scene.background = new THREE.Color(0xFFFFFF);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- V1 GEOMETRY ---
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const wireframe = new THREE.WireframeGeometry(geometry);

    const material = new THREE.LineBasicMaterial({
        color: 0x1E2029, // Charcoal
        linewidth: 1,
        opacity: 0.4,
        transparent: true
    });

    // Renamed to 'sphere' for consistency with V1's animation logic
    const sphere = new THREE.LineSegments(wireframe, material);
    scene.add(sphere);

    // Add floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 400;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0xFF4D00 // Axis Orange
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 6;

    // Interaction
    let mouseX = 0;
    let mouseY = 0;

    if (window.matchMedia("(min-width: 768px)").matches) {
        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX / window.innerWidth - 0.5;
            mouseY = event.clientY / window.innerHeight - 0.5;
        });
    }

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // --- V1 ANIMATION LOGIC ---
        sphere.rotation.y += 0.002;
        sphere.rotation.x += 0.001;

        // Interactive rotation based on mouse
        sphere.rotation.y += mouseX * 0.05;
        sphere.rotation.x += mouseY * 0.05;

        particlesMesh.rotation.y = -elapsedTime * 0.05 + (mouseX * 0.2);

        renderer.render(scene, camera);
    }

    animate();

    // Robust Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // GSAP Animations
    window.addEventListener('load', () => {
        const tl = gsap.timeline();

        tl.to("#loader", {
            y: "-100%",
            duration: 1,
            ease: "power4.inOut",
            delay: 1.0
        })
            .from("nav", {y: -100, opacity: 0, duration: 0.8}, "-=0.5")
            .from(".h1-responsive", {y: 50, opacity: 0, duration: 1, ease: "power3.out"}, "-=0.5");

        // Scroll Triggers
        gsap.utils.toArray('section').forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                opacity: 0,
                y: 20,
                duration: 0.6
            });
        });
    });