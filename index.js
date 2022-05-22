document.addEventListener('DOMContentLoaded', () => {
    Initialize();
});


const Initialize = async () => {
    console.log('Ready!');

    const FetchBook = async () => {
        return new Promise(async (resolve, reject) => {

            const data = await fetch('/public/book.json')
            const book = await data.json();

            console.log(book)

            return resolve(book);
        });
    }

    const saveCurrentPage = (page = Number) => {
        console.log("saving");
        localStorage.setItem('current-page', page);
    }

    const loadCurrentPage = () => {
        if (!localStorage.getItem('current-page')) { return 0; }
        return Number.parseInt(localStorage.getItem('current-page'));
    }

    const state = {
        data: await FetchBook(),
        currentPage: loadCurrentPage(),
        pages: Array.from(document.getElementsByClassName('content')),
        transition: false,
    }

    console.log(state);


    const Render = () => {
        state.pages.forEach((page, index) => {

            if (index == 2) {
                return;
            }

            const pageElement = document.getElementById(`p${index + 1}`);
            const contentElement = pageElement.firstElementChild;

            contentElement.replaceChildren([]);

            const pageData = state.data.pages[index];
            const title = document.createElement('h1');

            // Custom ID's
            if (pageData.id != null) { contentElement.id = pageData.id; } else { contentElement.id = 'page'; }

            title.textContent = pageData.title;
            contentElement.appendChild(title);

            pageData.sections.forEach(section => {
                const sectionElement = document.createElement('div');
                sectionElement.className = "section"

                // Optional - title
                if (section.title != null) {
                    const titleElement = document.createElement('h2');
                    titleElement.textContent = section.title;
                    titleElement.className = "section-title";
                    contentElement.appendChild(titleElement);
                }

                // Optional - content
                if (section.content != null) {

                    section.content.forEach(text => {
                        const textElement = document.createElement('h4');
                        textElement.textContent = text;
                        textElement.id = section.title == null ? 'no-title' : ''
                        sectionElement.appendChild(textElement);
                    });

                }

                // Optional - image
                if (section.image != null) {
                    if (section.image.id == 'full-page') {
                        pageElement.style.backgroundImage = `url(${section.image.url})`;
                    }
                    else {
                        const imageElement = document.createElement('img');
                        imageElement.style.backgroundImage = `url(${section.image.url})`;
                        imageElement.id = section.image.id;
                        imageElement.width = section.image.size[0];
                        imageElement.height = section.image.size[1];
                        sectionElement.appendChild(imageElement);
                    }
                }

                contentElement.appendChild(sectionElement);

            });


            document.getElementById('page-1-num').textContent = `${pageData.page}.`;
            document.getElementById('page-2-num').textContent = `${pageData.page + 1}.`;
        });
    }

    const NextPage = (reverse = Boolean) => {
        document.getElementById('p3').style.opacity = '0%';
        document.getElementById('p3').style.transition = 'none'

        if (!reverse) {
            document.getElementById('p3').style.transform = 'rotateY(-7deg)';
        }
        else {
            document.getElementById('p3').style.transform = 'rotateY(-170deg)';
        }

        setTimeout(() => {

            // ANIMATION
            document.documentElement.style.setProperty('--page-opacity', 0);
            document.getElementById('p3').style.opacity = '100%';

            if (!reverse) {
                document.getElementById('p3').style.transition = 'transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1), box-shadow .35s ease-in-out';
                document.getElementById('p3').style.transform = 'rotateY(-170deg)';
            }
            else {
                document.getElementById('p3').style.transition = 'transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1), box-shadow .35s ease-in-out';
                document.getElementById('p3').style.transform = 'rotateY(-7deg)';
            }


            state.transition = true;

            setTimeout(() => {
                state.data.pages = shiftPage(state.data.pages, reverse);

                // ANIMATION
                document.documentElement.style.setProperty('--page-opacity', 1);


                // RENDER
                Render();

                // ANIMATION
                document.getElementById('p3').style.opacity = '0%';
                document.getElementById('p3').style.transition = 'none'

                if (!reverse) {
                    document.getElementById('p3').style.transform = 'rotateY(-170deg)';
                }
                else {
                    document.getElementById('p3').style.transform = 'rotateY(-7deg)';
                }
                state.transition = false;
            }, 910);

        }, 10);

    }

    for (let i = 0; i < state.currentPage; i++) {
        NextPage(false);
    }


    const shiftPage = (pages = [], reverse = Boolean) => {
        switch (reverse) {
            case true:
                let p1 = pages.pop()
                pages.unshift(p1);
                p1 = pages.pop()
                pages.unshift(p1);
                break;
            case false:
                let p2 = pages.shift()
                pages.push(p2);
                p2 = pages.shift()
                pages.push(p2);
                break;
        }

        return pages;
    }

    document.getElementById('p2').addEventListener('mousedown', (e) => {

        if (state.transition) return;
        NextPage(false);

        state.currentPage += 1;
        const index = state.currentPage % (state.data.pages.length / 2);
        saveCurrentPage(index);
    });

    document.getElementById('p1').addEventListener('mousedown', (e) => {

        if (state.transition) return;
        NextPage(true);

        state.currentPage -= 1;
        const index = state.currentPage % (state.data.pages.length / 2);
        saveCurrentPage(index);
    });

    Render();
}
