const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
};

ScrollReveal().reveal(".i img", {
    ...scrollRevealOption,
    origin: "right",
});
ScrollReveal().reveal(".productos-exhibicion h2", {
    ...scrollRevealOption,
    delay: 500,
});