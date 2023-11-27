function volumeChange (event) {
    browser.storage.local.set({
        volume: event.target.volume
    });
}

function createNextEpisodeButton (video) {
    let video_wrapper = document.createElement('div');
    video_wrapper.style.position = 'relative';
    video_wrapper.style.width = '100%';
    video_wrapper.style.height = 'max-content';

    video.parentNode.prepend(video_wrapper);
    video_wrapper.append(video);

    let nextButton = document.createElement('button');

    nextButton.style.position = 'absolute';
    nextButton.style.right = '0';
    nextButton.style.top = '80%';
    nextButton.style.zIndex = '1000';
    nextButton.style.fontSize = '1.5em';
    nextButton.style.padding = '10px 20px';
    nextButton.style.borderRadius = '5px';
    nextButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    nextButton.style.color = 'white';
    nextButton.style.border = 'white 1px solid';
    nextButton.style.cursor = 'pointer';

    nextButton.innerHTML = 'Next';
    nextButton.addEventListener('click', jumpToNextEpisode);

    nextButton.style.display = 'none';

    video_wrapper.append(nextButton)

    return nextButton;
}

function nextEpisode () {
    let episodes = document.getElementsByClassName('episode');

    for (let i = 0; i < episodes.length; i++) {
        if (episodes[i].classList.contains('active_episode')) {
            if (i + 1 < episodes.length) {
                return episodes[i + 1]
            }
            break;
        }
    }

    return null;
}

function jumpToNextEpisode () {
    const next = nextEpisode();
    console.log("Next")
    if (next !== null) {
        let current = document.querySelector('.active_episode');
        if (current === current.parentNode.lastChild) {
            let select = document.querySelector('select');
            let option = select.options[select.selectedIndex + 1];
            if (option !== undefined) {
                option.selected = true;
                select.dispatchEvent(new Event('change'));
            }
        }

        next.click();
    }
}

function check_video_end (event, nextButton) {
    let video = event.target;
    if (video.ended) {
        jumpToNextEpisode();
    }

    if (video.duration - video.currentTime < 60) {
        nextButton.style.display = 'block';
    } else {
        nextButton.style.display = 'none';
    }
}


window.addEventListener('load', () => {
    const video = document.querySelector('video');
    browser.storage.local.get('volume').then((result) => {
        let volume = result.volume;
        if (volume === undefined) {
            volume = 1;
        }
        video.volume = volume;
    });

    if (document.querySelector('select.season')) {
        const nextButton = createNextEpisodeButton(video);
        video.addEventListener('timeupdate', (event) => check_video_end(event, nextButton));
    }

    video.addEventListener('volumechange', volumeChange);
});