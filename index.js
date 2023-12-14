/*NAVBAR BUTTON*/
let navbar = document.querySelector('.navbar');
document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
}
/*WORLD MAP BUTTON*/
document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('.wrl_btn');
    var maps = document.querySelectorAll('.map');

    // Show the default map (GDP) and mark GDP button as selected
    buttons[0].classList.add('selected');
    maps[0].style.display = 'block';

    buttons.forEach(function (button, index) {
        button.addEventListener('click', function () {
            buttons.forEach(function (btn) {
                btn.classList.remove('selected');
            });
            button.classList.add('selected');

            // Hide all maps
            maps.forEach(function (map) {
                map.style.display = 'none';
            });

            // Show the selected map
            maps[index].style.display = 'block';
        });
    });
});



