function changeBg(background, contentClass) {
    const banner = document.querySelector('.banner');
    const contents = document.querySelectorAll('.content');

    if (banner && background) {
        banner.style.backgroundImage = "url('./movies/" + background + "')";
    }

    contents.forEach(function (content) {
        content.classList.remove('active');
    });

    const selected = contentClass
        ? document.querySelector('.content.' + contentClass)
        : null;
    if (selected) selected.classList.add('active');
}

function toggleVideo() {
    const trailer = document.querySelector('.trailer');
    const video = document.querySelector('#trailer-video');
    if (!trailer || !video) return;

    const isOpen = !trailer.classList.contains('active');
    trailer.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
        video.muted = false;
        video.load();
        const playPromise = video.play();
        if (playPromise) {
            playPromise.catch(function () {
                video.muted = true;
                video.play().catch(function () {});
            });
        }
    } else {
        video.pause();
        video.currentTime = 0;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const trailer = document.querySelector('.trailer');
    const video = document.querySelector('#trailer-video');
    const closeButton = document.querySelector('.close');

    if (window.M && typeof window.M.Carousel.init === 'function') {
        window.M.Carousel.init(document.querySelectorAll('.carousel'), {
            dist: -100,
            numVisible: 5,
            padding: 20
        });
    }

    const playButton = document.querySelector('.play');
    if (playButton) {
        playButton.addEventListener('click', function (event) {
            event.preventDefault();
            toggleVideo();
        });
    }

    document.querySelectorAll('.watch-button').forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            toggleVideo();
        });
    });

    document.querySelectorAll('.list-button').forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            button.classList.toggle('selected');
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = button.classList.contains('selected')
                    ? 'fa fa-check'
                    : 'fa fa-plus';
            }
        });
    });

    if (trailer) {
        trailer.addEventListener('click', function (event) {
            if (event.target === trailer) toggleVideo();
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', toggleVideo);
        closeButton.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleVideo();
            }
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' &&
            trailer && trailer.classList.contains('active')) {
            toggleVideo();
        }
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const filter = link.dataset.filter;

            if (filter === 'Adults') {
                changeBg('bg-the-tank.jpeg', 'the-tank');
            } else if (filter === 'Trend') {
                changeBg('bg-the-black-demon.jpeg', 'the-black-demon');
            } else if (filter === 'Kids') {
                document.querySelectorAll('.content').forEach(function (content) {
                    content.classList.remove('active');
                });
            } else {
                changeBg('bg-little-mermaid.jpg', 'the-little-mermaid');
            }
        });
    });

    const search = document.querySelector('.search input');
    if (search) {
        search.addEventListener('input', function () {
            const query = search.value.trim().toLowerCase();
            const contents = document.querySelectorAll('.content');

            if (!query) {
                if (!document.querySelector('.content.active')) {
                    changeBg('bg-little-mermaid.jpg', 'the-little-mermaid');
                }
                return;
            }

            let match = null;
            contents.forEach(function (content) {
                if (!match) {
                    const title = content.querySelector('img');
                    const text = content.textContent + ' ' +
                        (title ? title.alt : '');
                    if (text.toLowerCase().includes(query)) match = content;
                }
            });

            if (match) {
                contents.forEach(function (content) {
                    content.classList.remove('active');
                });
                match.classList.add('active');
            }
        });
    }

    if (video) {
        video.addEventListener('error', function () {
            video.setAttribute('aria-label', 'Trailer unavailable');
        });
    }
});
