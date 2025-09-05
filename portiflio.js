const canvas = document.getElementById('hero-canvas');
if (canvas) {
    // Scene Setup
    const scene = new THREE.Scene();
    
    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Camera Setup
    const fov = 75;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);
    
    // 3D Model: A rotating torus knot
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x87ceeb, // A sky blue color
        roughness: 0.1,
        metalness: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 2.5
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    
    // Mouse Interaction
    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.005;
        mouseY = (event.clientY - windowHalfY) * 0.005;
    });

    // Handle window resizing
    window.addEventListener('resize', () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);
        
        // Rotate the torus knot based on time and mouse movement
        torusKnot.rotation.x += 0.005;
        torusKnot.rotation.y += 0.005;

        // Simple orbit effect based on mouse position
        const targetX = mouseX * -0.5;
        const targetY = mouseY * -0.5;
        torusKnot.rotation.x += 0.05 * (targetY - torusKnot.rotation.x);
        torusKnot.rotation.y += 0.05 * (targetX - torusKnot.rotation.y);
        
        renderer.render(scene, camera);
    };

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is in view, so we animate it
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                // Stop observing after the animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        // The root is the viewport, and we'll check for an intersection
        // when the element is 10% visible
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    // Start observing all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Typewriter effect for the introductory text
    const typedTextElement = document.getElementById('typed-text');
    const cursorElement = document.getElementById('cursor');
    const textToType = "A motivated BTech student passionate about problem-solving, data structures, algorithms, and web development. Welcome to my portfolio!";
    let charIndex = 0;

    function typeWriter() {
        if (charIndex < textToType.length) {
            typedTextElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        } else {
            // Hide the cursor once the typing is complete
            cursorElement.style.display = 'none';
        }
    }

    // Start the 3D animation and typewriter effect on page load
    window.onload = function() {
        animate();
        typeWriter();
    };
}