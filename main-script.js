gsap.from(".logo1", {
    x: -600,
    opacity: 0,
    duration: 1.2
})

gsap.from(".logo2", {
    x: 600,
    opacity: 0,
    duration: 1.2
})

var tl = gsap.timeline();

tl.from("footer", {
    y: 70,
    opacity: 0,
    duration: 1,
    delay: 1.1
})

tl.from(".hero-img", {
    x: -300,
    duration: 1.2,
    opacity: 0
})

tl.from(".top-info img", {
    scale: 0,
    opacity: 0
})

tl.from(".top-info span", {
    x: 70,
    opacity: 0,
    duration: 1
})

tl.from(".bottom-info img", {
    scale: 0,
    opacity: 0
})

tl.from(".bottom-info p", {
    x: -50,
    opacity: 0,
    duration: 1
})

tl.from(".n-anim", {
    y: -50,
    opacity: 0,
    duration: 1
})