document.addEventListener('DOMContentLoaded', function() {
  bulmaCarousel.attach('.carousel', {
    slidesToScroll: 1,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    loop: true,
    infinite: true,
    pagination: true,
    navigation: true,
    direction: 'ltr'
  });
}); 