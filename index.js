/*NAVBAR BUTTON*/
let navbar = document.querySelector('.navbar');
document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
}
/*WORLD MAP BUTTON*/
document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('.wrl_btn');
    var maps = document.querySelectorAll('.map');
    maps[0].style.display = 'block';
});



